import { MailService } from '@intune/nestjs-mail';
import { Injectable } from '@nestjs/common';
import { TestMail } from './mails/test.mail';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailService) {}

  async getHello(): Promise<string> {
    await this.mailService.send(
      new TestMail('tobiolanitori@gmail.com', '12345'),
    );

    await this.mailService
      .getTransporter('fallback')
      .send(new TestMail('tobiolanitori1@gmail.com', '123456'));
    return 'Hello World!';
  }
}
