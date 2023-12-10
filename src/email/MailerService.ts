import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

@Injectable()
export class EmailService {
  protected readonly EMAIL_FROM: string = process.env.GMAIL_USER;
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    toEmail: string,
    subject: string,
    from: string,
    html: string,
  ): Promise<boolean> {
    const mail = {
      to: toEmail,
      subject,
      from,
      html,
    };
    const response = await this.mailerService.sendMail(mail);
    return response['rejected'].length === 0 ? true : false;
  }

  async send2faEmail(toEmail: string, code: string): Promise<boolean> {
    const prepared2faEmail = await this.prepare2faEmail(toEmail, code);
    const response = await this.mailerService.sendMail(prepared2faEmail);
    return response['rejected'].length === 0 ? true : false;
  }

  async prepare2faEmail(email: string, code: string) {
    const readFile = util.promisify(fs.readFile);
    const templatePath = path.join(process.cwd(), './src/templates/2fa.html');
    const htmlTemplate = await readFile(templatePath, 'utf-8');
    const customizedHtml = htmlTemplate.replace('{{code}}', code);

    return {
      to: email,
      subject: '[PRIVATE] Two-Factor Verification Code',
      from: this.EMAIL_FROM,
      html: customizedHtml,
    };
  }
}
