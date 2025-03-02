import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class EmailService {
  private transport: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly appConfigService: AppConfigService) {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    this.transport = nodemailer.createTransport({
      host: this.appConfigService.getEmailHost(),
      port: 2525,
      auth: {
        user: this.appConfigService.getEmailUser(),
        pass: this.appConfigService.getEmailPass(),
      },
    });
  }

  async sendEmail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    await this.transport.sendMail({
      from: this.appConfigService.getEmailUser(),
      to,
      subject,
      text,
    });
  }
}
