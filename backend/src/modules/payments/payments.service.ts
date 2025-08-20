import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentSubscription } from './dto/create-subscription.dto';
import { UserService } from '../user/user.service';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { UserType } from '../user/enum/user-type';
import { SubscriptionInfos } from '../user/entities/user.entity';
import { SubscriptionDoneDto } from './dto/subscription-done.dto';
import { secondsToDateTime } from 'src/utils/helper';
import { BackgroundService } from '../background/background.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { log } from 'console';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    private userService: UserService,
    private backgroundService: BackgroundService,
    @Inject(REQUEST) private request: RequestModel,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  private async createCustomer(
    createPaymentSubscription: CreatePaymentSubscription,
  ): Promise<Stripe.Customer> {
    const { userId } = this.request;
    const user = await this.userService.findOne(+userId);
    if (user.type === UserType.PREMIUM) {
      throw new BadRequestException('user already premium');
    }

    return this.stripe.customers.create({
      name: user.username,
      email: user.email,
      payment_method: createPaymentSubscription.payment_method_id,
      invoice_settings: {
        default_payment_method: createPaymentSubscription.payment_method_id,
      },
    });
  }

  async createSubscription(
    createPaymentSubscription: CreatePaymentSubscription,
  ): Promise<any> {
    const { userId } = this.request;
    const user = await this.userService.findOne(+userId);

    const customer = await this.createCustomer(createPaymentSubscription);

    const promotionCode = await this.stripe.promotionCodes.retrieve(
      process.env.lofily_PROMOCODE_ID,
    );

    if (
      promotionCode &&
      createPaymentSubscription.promocode &&
      createPaymentSubscription.promocode !== promotionCode.code
    ) {
      throw new NotFoundException('promo code not found');
    }
    const subscriptionBody: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      items: [{ price: createPaymentSubscription.price_id }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: 'any',
          },
        },
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: { customerEmail: user.email },
    };
    const price: Stripe.Response<Stripe.Price> =
      await this.stripe.prices.retrieve(createPaymentSubscription.price_id);

    // we are using promocode only for yearly subscription
    const shouldApplyPromoCode =
      promotionCode &&
      createPaymentSubscription.promocode &&
      price?.recurring?.interval === 'year';

    if (shouldApplyPromoCode) {
      subscriptionBody.promotion_code = promotionCode.id;
    }
    const subscription = await this.stripe.subscriptions.create(
      subscriptionBody,
    );

    return {
      //@ts-expect-error no error
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      subscription_id: subscription.id,
      customer_id: customer.id,
    };
  }

  getPrices() {
    return this.stripe.prices
      .list({
        product: process.env.lofily_PRODUCT_ID,
      })
      .then(({ data }) => data);
  }

  async cancelSubscription() {
    const { userId } = this.request;
    const user = await this.userService.findOne(+userId);

    if (user?.subscription_infos.subscription_id) {
      try {
        return this.stripe.subscriptions
          .update(user.subscription_infos.subscription_id, {
            cancel_at_period_end: true,
          })
          .then(() => {
            const newUser: UpdateUserDto = {
              ...user,
              subscription_infos: {
                ...user.subscription_infos,
                cancel_requested: true,
              },
            };
            return this.userService
              .updateById(user.id, newUser)
              .then(() => newUser);
          });
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
    throw new BadRequestException('the user dont have subscription');
  }

  async checkCodePromo(value: string) {
    const promotionCode = await this.stripe.promotionCodes.retrieve(
      process.env.lofily_PROMOCODE_ID,
    );
    return {
      valid: promotionCode.active && promotionCode.code === value,
      percent_off: promotionCode.coupon.percent_off,
    };
  }

  invoicePreview() {}

  async updateUserInfosAfterSubscriptionDone(
    subscriptionDoneDto: SubscriptionDoneDto,
  ) {
    const { userId } = this.request;

    if (!userId) throw new UnauthorizedException();

    const user = await this.userService.findOne(+userId);

    if (!user) throw new NotFoundException('user not found');
    const customer = await this.stripe.customers.retrieve(
      subscriptionDoneDto.customer_id,
    );

    if (!customer) throw new NotFoundException('customer not found');

    const subscription = await this.stripe.subscriptions.retrieve(
      subscriptionDoneDto.subscription_id,
    );

    if (!subscription) throw new NotFoundException('subscription not found');

    const paymentMethodResult = await this.stripe.paymentMethods.list({
      customer: customer.id,
    });

    if (!paymentMethodResult || !paymentMethodResult.data.length)
      throw new NotFoundException('paymentMethod not found');

    const paymentMethod = paymentMethodResult.data[0];

    const format_card_exp_month =
      paymentMethod.card.exp_month.toString().length === 1
        ? '0' + paymentMethod.card.exp_month.toString().length
        : paymentMethod.card.exp_month.toString();

    const invoice = await this.stripe.invoices.retrieve(
      subscription.latest_invoice.toString(),
    );

    const subscriptionInfos: SubscriptionInfos = {
      card_exp: `${format_card_exp_month}/${paymentMethod.card.exp_year}`,
      card_last_4: paymentMethod.card.last4,
      currency: subscription.currency,
      subscription_start: secondsToDateTime(
        subscription.current_period_start,
      ).toDateString(),
      subscription_end: secondsToDateTime(
        subscription.current_period_end,
      ).toDateString(),
      amount: subscription.items.data[0].plan.amount / 100,
      amout_after_coupon: invoice.amount_paid / 100,
      interval: subscription.items.data[0].plan.interval,
      subscription_id: subscriptionDoneDto.subscription_id,
      customer_id: subscriptionDoneDto.customer_id,
      invoice_pdf: invoice.invoice_pdf,
    };
    if (invoice.discount) {
      subscriptionInfos.coupon_percent_of = invoice.discount.coupon.percent_off;
    }
    await this.userService.updateById(user.id, {
      ...user,
      subscription_infos: subscriptionInfos,
      type: UserType.PREMIUM,
    });
    return subscriptionInfos;
  }
}
