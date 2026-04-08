import * as nodemailer from "nodemailer"
import { HttpException } from "@nestjs/common"

import { SmtpMailStrategy } from "./smtp.service"
import { MailModuleOptions } from "../../interface/config.interface"
import { TestMailable } from "../../testing/test.mailable"

jest.mock("nodemailer", () => ({
    createTransport: jest.fn()
}))

describe("SmtpMailStrategy", () => {
    const createTransport = nodemailer.createTransport as jest.Mock
    const mailOptions: MailModuleOptions = {
        from: {
            address: "sender@example.com",
            name: "Sender Name"
        },
        default: "primary",
        clients: {}
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("throws when setOptions receives incomplete config", () => {
        const strategy = new SmtpMailStrategy(mailOptions)

        expect(() =>
            strategy.setOptions({
                transport: "smtp",
                host: "",
                port: 587,
                auth: {
                    user: "user",
                    pass: "pass"
                }
            })
        ).toThrow(new HttpException("Smtp config not set", 500))
    })

    it("sends a transformed smtp message after initialization", async () => {
        const verify = jest.fn().mockResolvedValue(undefined)
        const sendMail = jest.fn().mockResolvedValue({ messageId: "123" })
        createTransport.mockReturnValue({
            verify,
            sendMail
        })

        const strategy = new SmtpMailStrategy(mailOptions)
        const mail = new TestMailable()

        strategy.setOptions({
            transport: "smtp",
            host: "smtp.example.com",
            port: 587,
            auth: {
                user: "user",
                pass: "pass"
            }
        })

        await strategy.send(mail)

        expect(createTransport).toHaveBeenCalledWith({
            transport: "smtp",
            host: "smtp.example.com",
            port: 587,
            auth: {
                user: "user",
                pass: "pass"
            }
        })
        expect(verify).toHaveBeenCalled()
        expect(sendMail).toHaveBeenCalledWith(
            mail.getSmtpMessage(mailOptions.from)
        )
    })

    it("throws when send is called before initialization", async () => {
        const strategy = new SmtpMailStrategy(mailOptions)

        await expect(strategy.send(new TestMailable())).rejects.toThrow(
            new HttpException("SMTP configuration not set", 500)
        )
    })
})
