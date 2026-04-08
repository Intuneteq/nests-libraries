import { Test } from "@nestjs/testing"

import { CONFIG_OPTIONS } from "./entities/config"
import { MAIL_STRATEGY } from "./entities/strategies"
import { MailModule } from "./mail.module"
import { MailService } from "./mail.service"

describe("MailModule", () => {
    const options = {
        from: {
            address: "sender@example.com",
            name: "Sender Name"
        },
        default: "primary",
        clients: {
            primary: {
                transport: "smtp" as const,
                host: "smtp.example.com",
                port: 587,
                auth: {
                    user: "user",
                    pass: "pass"
                }
            }
        }
    }

    it("registers sync providers and exports", () => {
        const dynamicModule = MailModule.register(options)
        const providers = dynamicModule.providers ?? []

        expect(dynamicModule.module).toBe(MailModule)
        expect(providers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    provide: CONFIG_OPTIONS,
                    useValue: options
                }),
                expect.objectContaining({ provide: MAIL_STRATEGY.smtp }),
                expect.objectContaining({ provide: MAIL_STRATEGY.ses }),
                expect.objectContaining({ provide: MAIL_STRATEGY.mailgun }),
                MailService
            ])
        )
        expect(dynamicModule.exports).toEqual(
            expect.arrayContaining([
                MailService,
                CONFIG_OPTIONS,
                MAIL_STRATEGY.smtp,
                MAIL_STRATEGY.ses,
                MAIL_STRATEGY.mailgun
            ])
        )
    })

    it("registers async options using a factory", () => {
        const useFactory = jest.fn().mockReturnValue(options)

        const dynamicModule = MailModule.registerAsync({
            useFactory,
            inject: ["TOKEN"]
        })
        const providers = dynamicModule.providers ?? []

        expect(dynamicModule.module).toBe(MailModule)
        expect(providers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    provide: CONFIG_OPTIONS,
                    useFactory,
                    inject: ["TOKEN"]
                }),
                expect.objectContaining({ provide: MAIL_STRATEGY.smtp }),
                expect.objectContaining({ provide: MAIL_STRATEGY.ses }),
                expect.objectContaining({ provide: MAIL_STRATEGY.mailgun }),
                MailService
            ])
        )
    })

    it("can be imported into a Nest testing module", async () => {
        const testingModule = await Test.createTestingModule({
            imports: [MailModule.register(options)]
        }).compile()

        expect(testingModule.get(MailService)).toBeInstanceOf(MailService)
        expect(testingModule.get(CONFIG_OPTIONS)).toEqual(options)
    })
})
