import { TestMailable } from '../testing/test.mailable'

describe('Mailable', () => {
  const from = {
    address: 'sender@example.com',
    name: 'Sender Name',
  }

  it('builds an SMTP message from the mailable', () => {
    const mail = new TestMailable()

    expect(mail.getSmtpMessage(from)).toEqual({
      subject: 'Welcome aboard',
      from: {
        address: 'sender@example.com',
        name: 'Sender Name',
      },
      to: [{ address: 'recipient@example.com', name: '' }],
      cc: [{ address: 'copy@example.com', name: '' }],
      bcc: [{ address: 'blind@example.com', name: '' }],
      replyTo: [{ address: 'reply@example.com', name: '' }],
      inReplyTo: undefined,
      text: 'Plain text body',
      html: undefined,
      priority: undefined,
      attachments: [
        {
          content: 'hello world',
          path: undefined,
          filename: 'welcome.txt',
          cid: undefined,
          encoding: undefined,
          contentType: 'text/plain',
          contentTransferEncoding: undefined,
          contentDisposition: 'attachment',
          headers: undefined,
          raw: undefined,
        },
      ],
      headers: [{ key: 'X-Trace-Id', value: 'trace-123' }],
      date: undefined,
      attachDataUrls: undefined,
    })
  })

  it('builds an SES message from the mailable', () => {
    const mail = new TestMailable()

    expect(mail.getSesMessage(from)).toEqual({
      FromEmailAddress: 'Sender Name <sender@example.com>',
      ReplyToAddresses: ['reply@example.com'],
      Destination: {
        ToAddresses: ['recipient@example.com'],
        CcAddresses: ['copy@example.com'],
        BccAddresses: ['blind@example.com'],
      },
      Content: {
        Simple: {
          Subject: { Data: 'Welcome aboard' },
          Body: {
            Text: { Data: 'Plain text body' },
            Html: undefined,
          },
          Attachments: [
            {
              RawContent: Buffer.from('hello world'),
              FileName: 'welcome.txt',
              ContentDisposition: 'ATTACHMENT',
              ContentDescription: '',
              ContentId: undefined,
              ContentTransferEncoding: 'SEVEN_BIT',
              ContentType: 'text/plain',
            },
          ],
        },
      },
      EmailTags: [{ Name: 'X-Trace-Id', Value: 'trace-123' }],
    })
  })

  it('builds a Mailgun message from the mailable', () => {
    const mail = new TestMailable()

    expect(mail.getMailGunMessage(from)).toEqual({
      text: 'Plain text body',
      html: undefined,
      from: 'Sender Name <sender@example.com>',
      to: ['recipient@example.com'],
      cc: ['copy@example.com'],
      bcc: ['blind@example.com'],
      subject: 'Welcome aboard',
      attachment: [
        {
          data: Buffer.from('hello world'),
          filename: 'welcome.txt',
          contentType: 'text/plain',
        },
      ],
    })
  })
})
