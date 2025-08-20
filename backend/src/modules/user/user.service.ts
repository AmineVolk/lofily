import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from 'src/error/badRequest.exception';
import { NotFoundException } from 'src/error/notFound.exception';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { RequestModel } from 'src/overrid/request';
import { getCurrentFormatedDate, getPercentageChange } from 'src/utils/helper';
import Stripe from 'stripe';
import { EventType } from '../event-track/entities/event-track.entity';
import { CreateUserDto } from './dto/create-user.dto';
import UpdateUserPasswordDto from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { UserType } from './enum/user-type';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private stripe: Stripe;

  constructor(
    private usersRepository: UserRepository,

    @Inject(REQUEST) private request: RequestModel,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async getUsers(page: number, limit: number, sort: string) {
    const { userId } = this.request;
    const user = await this.findOne(+userId);

    if (user.type !== UserType.ADMIN)
      throw new ForbiddenException('Resource not allowed');

    const skip = (page - 1) * limit;

    const users = await this.usersRepository.query(
      ` SELECT u.id,u.created, u.email, u."isEmailConfirmed",u.type,u.username,u.subscription_infos ,count(*) OVER() AS total 
        FROM public.user as u
        ORDER BY ${sort || 'created'} LIMIT ${limit} OFFSET ${skip}`,
    );

    const total = users.length ? users[0].total : 0;
    const usersMap = users.map((item) => {
      delete item.total;
      delete item.password;
      return item;
    });
    return {
      data: usersMap,
      total: parseInt(total),
      page,
      limit,
    };
  }

  async getUsersToExport() {
    const { userId } = this.request;
    const user = await this.findOne(+userId);

    if (user.type !== UserType.ADMIN)
      throw new ForbiddenException('Resource not allowed');
    return this.usersRepository
      .query(
        ` SELECT u.id,u.created, u.email, u."isEmailConfirmed",u.type,u.username,u.subscription_infos ,count(*) OVER() AS total 
        FROM public.user as u
      `,
      )
      .then((users) =>
        users.map((user) => {
          delete user.total;
          let subscription_infos = ``;
          if (user.subscription_infos.amount) {
            subscription_infos = `${user.subscription_infos.amount} ${user.subscription_infos.currency}/${user.subscription_infos.interval} `;
          }
          return {
            ...user,
            subscription_infos,
            isEmailConfirmed: user.isEmailConfirmed ? 'YES' : 'NO',
          };
        }),
      );
  }

  async saveOauthUser(user) {
    if (!user) {
      throw new NotFoundException('No user found');
    }
    const userDto = new CreateUserDto();
    userDto.email = user.email;
    return this.usersRepository.save(userDto);
  }

  async save(user: CreateUserDto): Promise<CreateUserDto> {
    Logger.debug('Create a new user');
    if (user.password) {
      const password = await this.encryptPassword(user.password);
      user.password = password;
    } else {
      throw new BadRequestException('Password is required');
    }

    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async findUserByEmail(mail: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: mail } });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserAndBackground(id: number) {
    const result = await this.usersRepository.query(
      `
      with stats as (
        select user_id,sum(minute_spent) as total
        from event_track as et
        left join public.user as u on u.id = et.user_id
        where user_id = $1  and  et.day::date  > u.starter_begin_date::date
        group by (user_id)
      )
      
      select coalesce(stats.total,0)::int as  starter_usage_minutes, u.*, b.url as background_url, b.url_mobile as background_url_mobile
      from public.user as u
      left join background as b on b.id = u.background_id
      left join stats on stats.user_id = u.id
      where u.id = $1
      limit 1
    `,
      [id],
    );
    if (result.length) {
      const starter_begin_date = new Date(result[0].starter_begin_date);
      const minutesDayHistoryWhenStarterBegin =
        await this.usersRepository.query(
          `
          select *
          from event_track as et
          where et.user_id = $1 and day = $2
        `,
          [id, getCurrentFormatedDate(starter_begin_date)],
        );

      // minutes spent for the day when we begin the start is note used on the stats query.
      const dayMinutesSpentForTheDayStarterBegin =
        minutesDayHistoryWhenStarterBegin.length
          ? minutesDayHistoryWhenStarterBegin[0].minute_spent_day_history
              ?.map((item) => {
                const splitRes = item.split('/');

                const date = new Date(splitRes[0]);
                const spent_minutes = parseInt(splitRes[1] || 0);
                return {
                  spent_minutes,
                  date,
                };
              })
              .filter((item: { date: Date }) => item.date >= starter_begin_date)
          : [];

      const user = result[0];
      delete user.password;
      delete user.isemailconfirmed;
      const lastIndex = dayMinutesSpentForTheDayStarterBegin.length - 1;
      const totalMinutes =
        dayMinutesSpentForTheDayStarterBegin[lastIndex]?.spent_minutes -
        dayMinutesSpentForTheDayStarterBegin[0]?.spent_minutes;

      user.starter_usage_minutes =
        user.starter_usage_minutes + (totalMinutes || 0);
      delete user.minute_spent_day_history;

      return user;
    }
    return {};
  }

  findUserByUsername(username: string) {
    return this.usersRepository.find({ where: { username } });
  }

  async remove(id: number) {
    const { userId } = this.request;
    const user = await this.findOne(+userId);

    if (user.type !== UserType.ADMIN)
      throw new ForbiddenException('Resource not allowed');

    return this.usersRepository.delete(id);
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const userInDb = await this.usersRepository.findOne({ where: { id: +id } });

    const isSwitchingUserFromPremiumToFreemium =
      userInDb.type === UserType.PREMIUM &&
      updateUserDto.type === UserType.FREEMIUM;

    const isSwitchingUserFromFreemiumToPremimum =
      userInDb.type === UserType.FREEMIUM &&
      updateUserDto.type === UserType.PREMIUM;

    if (isSwitchingUserFromPremiumToFreemium) {
      console.log('isSwitchingUserFromPremiumToFreemium');

      updateUserDto.subscription_infos = {};
    }

    if (isSwitchingUserFromFreemiumToPremimum) {
      console.log('isSwitchingUserFromFreemiumToPremimum');

      updateUserDto.subscription_infos = {
        ...userInDb.subscription_infos,
        is_forced_by_admin: true,
      };
    }
    return this.usersRepository.update({ id }, updateUserDto);
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  public async resetPassword(email: string, newPassword: string) {
    const user = await this.findUserByEmail(email);
    if (!user.isEmailConfirmed) {
      throw new BadRequestException(
        'Confirm your email before trying to update your password',
      );
    }

    const hashedPassword = await this.encryptPassword(newPassword);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  async updateUserPassword(updateUserPasswordDto: UpdateUserPasswordDto) {
    const { userId } = this.request;
    const user = await this.findOne(+userId);

    const isPasswordValid = await this.login(
      updateUserPasswordDto.current_password,
      user.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const hashedNewPassword = await this.encryptPassword(
      updateUserPasswordDto.new_password,
    );

    return this.usersRepository.update(
      { id: user.id },
      {
        ...user,
        password: hashedNewPassword,
      },
    );
  }
  async login(givenPassword: string, passwordHash: string) {
    return bcrypt.compare(givenPassword, passwordHash);
  }

  getStats = async () => {
    const { userId } = this.request;
    const user = await this.findOne(+userId);

    if (user.type !== UserType.ADMIN)
      throw new ForbiddenException('Resource not allowed');

    const nbr_users = await this.usersRepository.query(
      `
        with stats as (
          select created::date, count(id) nbr_user
          from public.user
          where created >= NOW() - '7 days'::interval and public.user."isEmailConfirmed" = true
          group by created::date
          order by created::date desc
        )
        SELECT CURRENT_DATE - sequential_dates.date AS day,  coalesce(stats.nbr_user,0)::int as count
        FROM generate_series(0, 6) AS sequential_dates(date)
        left join stats on stats.created = CURRENT_DATE - sequential_dates.date
        order by CURRENT_DATE - sequential_dates.date asc
      `,
    );

    const nbr_users_premium = await this.usersRepository.query(
      `
        with stats as (
          select TO_DATE(subscription_infos::json ->>'subscription_start','Dy Mon DD YYYY') as subscription_start, count(id) nbr_premium
          from public.user
          where TO_DATE(subscription_infos::json ->>'subscription_start','Dy Mon DD YYYY') >= NOW() - '7 days'::interval 
              and type ='PREMIUM' and  public.user."isEmailConfirmed" = true
          group by TO_DATE(subscription_infos::json ->>'subscription_start','Dy Mon DD YYYY')
          order by TO_DATE(subscription_infos::json ->>'subscription_start','Dy Mon DD YYYY') desc
        )
        SELECT CURRENT_DATE - sequential_dates.date AS day,  coalesce(stats.nbr_premium,0)::int as count
        FROM generate_series(0, 6) AS sequential_dates(date)
        left join stats on stats.subscription_start = CURRENT_DATE - sequential_dates.date
        order by CURRENT_DATE - sequential_dates.date asc
    `,
    );

    const getOperator = (value: number) => {
      if (value > 0) return '+';
      return '';
    };

    const users_change = getPercentageChange(
      nbr_users[nbr_users.length - 1].count,
      nbr_users[nbr_users.length - 2].count,
    );

    const users_premium_change = getPercentageChange(
      nbr_users_premium[nbr_users_premium.length - 1].count,
      nbr_users_premium[nbr_users_premium.length - 2].count,
    );

    const nbr_users_progression = `${getOperator(
      users_change,
    )}${users_change}%`;

    const nbr_users_premium_progression = `${getOperator(
      users_premium_change,
    )}${users_premium_change}%`;

    const nbr_user_of_background = await this.usersRepository.query(`
      SELECT b.id,b.url,b.thumbnail,count(b.id)::int as count
      from background as b
      join public.user as u on u.background_id = b.id
      group by (b.id)
      limit 5;
    `);

    const nbr_user_of_effect = await this.usersRepository.query(`
      SELECT ume.music_effect_id as id,ume.music_effect_id,me."name", me.url, count(ume.user_id)::int
      from user_music_effect as ume
      left join public.user as u on u.id = ume.user_id
      join music_effect as me on me.id = ume.music_effect_id
      group by(ume.music_effect_id,me.url,me."name")
      limit 5;
    `);

    return {
      users_stats: {
        total: await this.usersRepository.count({
          where: { isEmailConfirmed: true },
        }),
        percent_progression: nbr_users_progression,
        last_7_days: nbr_users,
      },
      users_premimum_stats: {
        total: await this.usersRepository.count({
          where: { isEmailConfirmed: true, type: UserType.PREMIUM },
        }),
        percent_progression: nbr_users_premium_progression,
        last_7_days: nbr_users_premium,
      },
      nbr_user_of_background,
      nbr_user_of_effect,
    };
  };

  getUserStats = async (id: number) => {
    const { userId } = this.request;

    const app_using_last_7_days = await this.usersRepository.query(
      `
        with stats as (
          SELECT  id,day, minute_spent
          FROM public.event_track
          where user_id=$1 and type =$2 and  day::date >= NOW() - '7 days'::interval
        )
            
        SELECT  stats.id, TO_CHAR(CURRENT_DATE - sequential_dates.date, 'dd/mm/yyyy') as day, coalesce(stats.minute_spent,0)::int as minute_spent
        FROM generate_series(0, 6) AS sequential_dates(date)
        left join stats on stats.day::date = CURRENT_DATE - sequential_dates.date
        order by CURRENT_DATE - sequential_dates.date asc
      `,
      [userId, EventType.TIME_SPENT_ON_APP],
    );

    const app_using_last_30_days = await this.usersRepository.query(
      `
      with stats as (
        SELECT  id,day, minute_spent
        FROM public.event_track
        where user_id=$1 and type =$2 and  day::date >= NOW() - '30 days'::interval
      )
          
      SELECT  stats.id, TO_CHAR(CURRENT_DATE - sequential_dates.date, 'dd/mm/yyyy') as day, coalesce(stats.minute_spent,0)::int as minute_spent
      FROM generate_series(0, 30) AS sequential_dates(date)
      left join stats on stats.day::date = CURRENT_DATE - sequential_dates.date
      order by CURRENT_DATE - sequential_dates.date asc
      `,
      [userId, EventType.TIME_SPENT_ON_APP],
    );

    return {
      app_using: {
        last_7_days: app_using_last_7_days,
        last_30_days: app_using_last_30_days,
      },
    };
  };

  async getSubscriptionStatus(user: User): Promise<Stripe.Subscription.Status> {
    try {
      const customer = await this.stripe.customers.retrieve(
        user.subscription_infos.customer_id,
      );

      if (!customer) return 'canceled';

      const subscription = await this.stripe.subscriptions.retrieve(
        user.subscription_infos.subscription_id,
      );

      if (!subscription) return 'canceled';

      return subscription.status;
    } catch (err) {
      console.log('getSubscriptionStatus err ', err);
      return 'canceled';
    }
  }
}
