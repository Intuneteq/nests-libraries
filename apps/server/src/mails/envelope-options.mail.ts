import {
  Address,
  Attachment,
  Content,
  Envelope,
  type Header,
  Mailable,
} from '@intune/nestjs-mail';

export class EnvelopeOptionsMail extends Mailable {
  constructor(private readonly toEmail: string) {
    super();
  }

  public envelope(): Envelope {
    return new Envelope({
      from: new Address('notifications@example.com', 'Notifications Bot'),
      to: this.toEmail,
      subject: 'Envelope Options Demo',
      inReplyTo: 'previous.thread@example.com',
      references: ['<thread-a@example.com>', '<thread-b@example.com>'],
    });
  }

  public content(): Content {
    return new Content({
      text: 'This mail demonstrates from, inReplyTo, and references envelope options.',
    });
  }

  public attachments(): Attachment[] {
    return [];
  }

  public headers(): Header[] {
    return [{ key: 'X-Demo-Case', value: 'envelope' }];
  }
}
