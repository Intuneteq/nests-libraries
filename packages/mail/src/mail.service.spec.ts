import { HttpException } from '@nestjs/common'

import { CONFIG_OPTIONS } from './entities/config'
import { MAIL_STRATEGY } from './entities/strategies'
import { MailModuleOptions } from './interface/config.interface'
import { MailService } from './mail.service'
import { TestMailable } from './testing/test.mailable'

describe('MailService', () => {
  const baseOptions: MailModuleOptions = {
    from: {
      address: 'sender@example.com',
      name: 'Sender Name',
    },
    default: 'primary',
    clients: {
      primary: {
        transport: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'user',
          pass: 'pass',
        },
      },
      transactional: {
        transport: 'ses',
        region: 'eu-west-1',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      },
      marketing: {
        transport: 'mailgun',
        apiKey: 'api-key',
        domain: 'mg.example.com',
      },
    },
  }

  const createStrategy = () => ({
    from: baseOptions.from,
    setOptions: jest.fn().mockReturnThis(),
    send: jest.fn(),
    sendMessage: jest.fn(),
  })

  it('throws when the default transporter does not exist', () => {
    const smtpStrategy = createStrategy()
    const sesStrategy = createStrategy()
    const mailgunStrategy = createStrategy()

    expect(
      () =>
        new MailService(
          {
            ...baseOptions,
            default: 'missing',
          },
          sesStrategy as any,
          mailgunStrategy as any,
          smtpStrategy as any,
        ),
    ).toThrow(new HttpException('Invalid default transporter: missing', 500))
  })

  it('returns the correct strategy for a configured client', () => {
    const smtpStrategy = createStrategy()
    const sesStrategy = createStrategy()
    const mailgunStrategy = createStrategy()
    const service = new MailService(baseOptions, sesStrategy as any, mailgunStrategy as any, smtpStrategy as any)

    const transporter = service.getTransporter('marketing')

    expect(mailgunStrategy.setOptions).toHaveBeenCalledWith(baseOptions.clients.marketing)
    expect(transporter).toBe(mailgunStrategy)
  })

  it('throws when a client is not configured', () => {
    const service = new MailService(baseOptions, createStrategy() as any, createStrategy() as any, createStrategy() as any)

    expect(() => service.getTransporter('missing')).toThrow(new HttpException('Invalid client', 500))
  })

  it('sends with the default transporter', async () => {
    const smtpStrategy = createStrategy()
    const sesStrategy = createStrategy()
    const mailgunStrategy = createStrategy()
    const service = new MailService(baseOptions, sesStrategy as any, mailgunStrategy as any, smtpStrategy as any)
    const mail = new TestMailable()

    await service.send(mail)

    expect(smtpStrategy.setOptions).toHaveBeenCalledWith(baseOptions.clients.primary)
    expect(smtpStrategy.send).toHaveBeenCalledWith(mail)
    expect(sesStrategy.send).not.toHaveBeenCalled()
    expect(mailgunStrategy.send).not.toHaveBeenCalled()
  })
})
