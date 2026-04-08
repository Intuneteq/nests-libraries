import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
import { HttpException, InternalServerErrorException } from "@nestjs/common"

import { SesMailStrategy } from "./ses.service"
import { MailModuleOptions } from "../../interface/config.interface"
import { TestMailable } from "../../testing/test.mailable"

jest.mock("@aws-sdk/client-sesv2", () => {
    const send = jest.fn()
    const client = jest.fn().mockImplementation(() => ({ send }))
    const command = jest.fn().mockImplementation((input: unknown) => ({
        input
    }))

    return {
        SESv2Client: client,
        SendEmailCommand: command
    }
})

describe("SesMailStrategy", () => {
    const sesClient = SESv2Client as jest.Mock
    const sendEmailCommand = SendEmailCommand
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
        const strategy = new SesMailStrategy(mailOptions)

        expect(() =>
            strategy.setOptions({
                transport: "ses",
                region: "",
                accessKeyId: "key",
                secretAccessKey: "secret"
            })
        ).toThrow(new HttpException("Invalid SES configuration", 500))
    })

    it("sends a transformed SES message after initialization", async () => {
        const send = jest.fn().mockResolvedValue(undefined)
        sesClient.mockImplementation(() => ({ send }))

        const strategy = new SesMailStrategy(mailOptions)
        const mail = new TestMailable()

        strategy.setOptions({
            transport: "ses",
            region: "eu-west-1",
            accessKeyId: "key",
            secretAccessKey: "secret"
        })

        await strategy.send(mail)

        expect(sesClient).toHaveBeenCalledWith({
            region: "eu-west-1",
            credentials: {
                accessKeyId: "key",
                secretAccessKey: "secret"
            }
        })
        expect(sendEmailCommand).toHaveBeenCalledWith(
            mail.getSesMessage(mailOptions.from)
        )
        expect(send).toHaveBeenCalledWith({
            input: mail.getSesMessage(mailOptions.from)
        })
    })

    it("throws when send is called before initialization", async () => {
        const strategy = new SesMailStrategy(mailOptions)

        await expect(strategy.send(new TestMailable())).rejects.toThrow(
            new HttpException("SES configuration not set", 500)
        )
    })

    it("wraps provider errors in an internal server error", async () => {
        const send = jest.fn().mockRejectedValue(new Error("SES failed"))
        sesClient.mockImplementation(() => ({ send }))

        const strategy = new SesMailStrategy(mailOptions)
        strategy.setOptions({
            transport: "ses",
            region: "eu-west-1",
            accessKeyId: "key",
            secretAccessKey: "secret"
        })

        await expect(strategy.send(new TestMailable())).rejects.toThrow(
            InternalServerErrorException
        )
    })
})
