import {
  Attachment,
  Content,
  Envelope,
  type Header,
  Mailable,
} from '@intune/nestjs-mail';

export class TestMail extends Mailable {
  constructor(
    private readonly to: string,
    private readonly otp: string,
    private readonly expiresInMinutes = 5,
  ) {
    super();
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.to,
      subject: 'Login with otp',
    });
  }

  public content(): Content {
    return new Content({
      text: `Use this OTP to login: ${this.otp}. It expires in ${this.expiresInMinutes} minutes.`,
    });
  }

  public attachments(): Attachment[] {
    return [
      new Attachment({
        filename: 'otp.txt',
        contentType: 'text/plain',
        contentDisposition: 'attachment',
        content: `Your OTP is ${this.otp}. It expires in ${this.expiresInMinutes} minutes.`,
      }),
    ];
  }

  public headers(): Header[] {
    return [{ key: 'X-Mail-Type', value: 'otp' }];
  }
}
