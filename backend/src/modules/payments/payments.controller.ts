import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSubscription } from './dto/create-subscription.dto';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { SubscriptionDoneDto } from './dto/subscription-done.dto';

@UseInterceptors(RequestInterceptor)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/subscription/done')
  subscriptionDone(@Body() subscriptionDoneDto: SubscriptionDoneDto) {
    return this.paymentsService.updateUserInfosAfterSubscriptionDone(
      subscriptionDoneDto,
    );
  }

  @Post('/subscription/cancel')
  cancleSubscription() {
    return this.paymentsService.cancelSubscription();
  }

  @Post('/subscription')
  createSubscription(
    @Body() createPaymentSubscription: CreatePaymentSubscription,
  ) {
    return this.paymentsService.createSubscription(createPaymentSubscription);
  }

  @Get('/invoice-preview')
  getInvoicePreview() {
    return this.paymentsService.invoicePreview();
  }

  @Get('/codepromo/:value/check')
  checkCodePromo(@Param('value') value: string) {
    return this.paymentsService.checkCodePromo(value);
  }

  @Get('/prices')
  getPrices() {
    return this.paymentsService.getPrices();
  }
}
