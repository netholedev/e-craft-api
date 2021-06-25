import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService, private readonly i18n: I18nService) {}

  async sendForgotPasswordCode(to: string, code: string, lang: string = 'tr_TR') {
    await this.mailerService.sendMail({
      to,
      subject: 'Password Confirmation',
      template: './forgot-password.tpl.hbs',
      context: {
        code,
        codeMsg: await this.i18n.translate('CODE', { lang }),
      },
    });
  }
}
