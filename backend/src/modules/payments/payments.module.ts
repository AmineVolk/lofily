import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UserModule } from '../user/user.module';
import { BackgroundModule } from '../background/background.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [UserModule, BackgroundModule],
})
export class PaymentsModule {}
