import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import ConfirmEmailDto from '../user/dto/confirm-email.dto';
import EmailDTO from './dto/email.dto';
import EmailService from './email.service';
import ContactDTO from './dto/contact.dto';

@Controller('/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailService.confirmUserEmail(email);
  }

  @Post('/resend')
  async resendConfirmationLink(@Body() emailDTO: EmailDTO) {
    console.log(`Resend confirmation link to : ${emailDTO.email}`);
    await this.emailService.resendRegisterEmail(emailDTO.email);
  }

  @Post('/contact')
  async setContact(@Body() contactDTO: ContactDTO) {
    console.log(`Send contact : `, contactDTO);
    const validateRecpatchaResult =
      await this.emailService.validateRecaptchaToken(
        contactDTO.recaptcha_token,
      );
    console.log(`validateRecpatchaResult : `, validateRecpatchaResult);
    if (validateRecpatchaResult) {
      return this.emailService.sendContact(contactDTO);
    }
    throw new BadRequestException('invalid recaptcha toekn');
  }
}
