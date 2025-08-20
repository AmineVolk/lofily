import {
  INestApplication,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { TOKEN_TYPE } from 'src/constants/tokenType';
import { sign } from 'jsonwebtoken';
import { Provider } from 'src/constants/provider';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions, Repository } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { defaultSetting, User } from 'src/modules/user/entities/user.entity';
import { PomodoroType } from 'src/modules/pomodoro/enum/pomodoro-type';

export class TestHelper {
  moduleFixture: TestingModule;
  app: INestApplication;
  repository: Repository<User>;
  modules;
  constructor(modules) {
    this.modules = modules;
  }
  async initApp() {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),

        TypeOrmModule.forRootAsync({
          useFactory: async () =>
            Object.assign(await getConnectionOptions(), {
              autoLoadEntities: true,
            }),
        }),
        ...this.modules,
      ],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
    this.moduleFixture = moduleFixture;
    this.app = app;
    this.repository = this.moduleFixture.get('UserRepository');
    return { moduleFixture, app };
  }

  generateToken = (
    thirdPartyId: number,
    provider: Provider,
    tokenType: TOKEN_TYPE,
  ) => {
    try {
      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn:
          tokenType == TOKEN_TYPE.ACCESS_TOKEN
            ? Number(process.env.ACCESS_TOKEN_EXPIRATION)
            : Number(process.env.REFRESH_TOKEN_EXPIRATION),
      });

      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  };

  async createUserWithAccessToken() {
    const [createdUser] = await this.repository.query(
      `insert into public.user (email,fullname,created,updated,setting) 
       values ('test@gmail.com','testfullname',now(),now(),'${JSON.stringify(
         defaultSetting,
       )}') RETURNING id;
       `,
    );
    const accessToken = this.generateToken(
      createdUser.id,
      Provider.LOCAL,
      TOKEN_TYPE.ACCESS_TOKEN,
    );

    return {
      userid: createdUser.id,
      accessToken,
    };
  }

  async createPomodoro(
    userid,
    type = PomodoroType.pomodoro,
    startat = new Date().toISOString(),
    endat = new Date().toISOString(),
  ) {
    return this.repository
      .query(
        `
        insert into pomodoro (startat,endat,type,userid) values ('${startat}','${endat}','${type}', ${userid}) returning id;
      `,
      )
      .then((res) => res[0]);
  }

  async getPomodoroById(id) {
    return this.repository
      .query(`select * from pomodoro where id = ${id}`)
      .then((res) => res[0]);
  }

  async getUserById(id) {
    return this.repository
      .query(`select * from public.user where id = ${id}`)
      .then((res) => res[0]);
  }
  async createUserWithPomodoro(type: PomodoroType) {
    const { userid, accessToken } = await this.createUserWithAccessToken();
    const createdPomodoroId = await this.createPomodoro(userid, type);
    return {
      userid,
      accessToken,
      pomodoroid: createdPomodoroId,
    };
  }

  async cleanDb() {
    const tables = await this.repository
      .query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`,
      )
      .then((res) => res.map((item) => `public.${item.table_name}`))
      .then((res) => res.join(','));

    return this.repository.query(`TRUNCATE ${tables};`);
  }
}
