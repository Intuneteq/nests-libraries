import { HttpException } from "@nestjs/common"

import { MailModuleOptions } from "./interface/config.interface"
import { MailService } from "./mail.service"
import { TestMailable } from "./testing/test.mailable"
import { MailStrategy } from "./interface/service.interface"
import { SesMailStrategy } from "./strategies/ses/ses.service"
import { SmtpMailStrategy } from "./strategies/smtp/smtp.service"
import { MailgunMailStrategy } from "./strategies/mailgun/mailgun.service"

type MockMailStrategy = jest.Mocked<MailStrategy>

const asSesStrategy = (strategy: MockMailStrategy): SesMailStrategy =>
    strategy as unknown as SesMailStrategy

const asMailgunStrategy = (strategy: MockMailStrategy): MailgunMailStrategy =>
    strategy as unknown as MailgunMailStrategy

const asSmtpStrategy = (strategy: MockMailStrategy): SmtpMailStrategy =>
    strategy as unknown as SmtpMailStrategy

describe("MailService", () => {
    const baseOptions: MailModuleOptions = {
        from: {
            address: "sender@example.com",
            name: "Sender Name"
        },
        default: "primary",
        clients: {
            primary: {
                transport: "smtp",
                host: "smtp.example.com",
                port: 587,
                auth: {
                    user: "user",
                    pass: "pass"
                }
            },
            transactional: {
                transport: "ses",
                region: "eu-west-1",
                accessKeyId: "key",
                secretAccessKey: "secret"
            },
            marketing: {
                transport: "mailgun",
                apiKey: "api-key",
                domain: "mg.example.com"
            }
        }
    }

    const createStrategy = (): MockMailStrategy => {
        const strategy = {
            from: baseOptions.from,
            setOptions: jest.fn(),
            send: jest.fn<Promise<void>, [TestMailable]>()
        } as MockMailStrategy

        strategy.setOptions.mockReturnValue(strategy)

        return strategy
    }

    it("throws when the default transporter does not exist", () => {
        const smtpStrategy = createStrategy()
        const sesStrategy = createStrategy()
        const mailgunStrategy = createStrategy()

        expect(
            () =>
                new MailService(
                    {
                        ...baseOptions,
                        default: "missing"
                    },
                    asSesStrategy(sesStrategy),
                    asMailgunStrategy(mailgunStrategy),
                    asSmtpStrategy(smtpStrategy)
                )
        ).toThrow(
            new HttpException("Invalid default transporter: missing", 500)
        )
    })

    it("returns the correct strategy for a configured client", () => {
        const smtpStrategy = createStrategy()
        const sesStrategy = createStrategy()
        const mailgunStrategy = createStrategy()
        const service = new MailService(
            baseOptions,
            asSesStrategy(sesStrategy),
            asMailgunStrategy(mailgunStrategy),
            asSmtpStrategy(smtpStrategy)
        )

        const transporter = service.getTransporter("marketing")

        expect(mailgunStrategy.setOptions.mock.calls).toHaveLength(1)
        expect(mailgunStrategy.setOptions.mock.calls[0]).toEqual([
            baseOptions.clients.marketing
        ])
        expect(transporter).toBe(mailgunStrategy)
    })

    it("throws when a client is not configured", () => {
        const service = new MailService(
            baseOptions,
            asSesStrategy(createStrategy()),
            asMailgunStrategy(createStrategy()),
            asSmtpStrategy(createStrategy())
        )

        expect(() => service.getTransporter("missing")).toThrow(
            new HttpException("Invalid client", 500)
        )
    })

    it("sends with the default transporter", async () => {
        const smtpStrategy = createStrategy()
        const sesStrategy = createStrategy()
        const mailgunStrategy = createStrategy()
        const service = new MailService(
            baseOptions,
            asSesStrategy(sesStrategy),
            asMailgunStrategy(mailgunStrategy),
            asSmtpStrategy(smtpStrategy)
        )
        const mail = new TestMailable()

        await service.send(mail)

        expect(smtpStrategy.setOptions.mock.calls).toHaveLength(1)
        expect(smtpStrategy.setOptions.mock.calls[0]).toEqual([
            baseOptions.clients.primary
        ])
        expect(smtpStrategy.send.mock.calls).toHaveLength(1)
        expect(smtpStrategy.send.mock.calls[0]).toEqual([mail])
        expect(sesStrategy.send.mock.calls).toHaveLength(0)
        expect(mailgunStrategy.send.mock.calls).toHaveLength(0)
    })
})
