import axios from "axios"
import Mailgun from "mailgun.js"
import { HttpException } from "@nestjs/common"

import { MailgunMailStrategy } from "./mailgun.service"
import { MailModuleOptions } from "../../interface/config.interface"
import { TestMailable } from "../../testing/test.mailable"

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    },
    get: jest.fn()
}))

jest.mock("mailgun.js", () => {
    return jest.fn().mockImplementation(() => ({
        client: jest.fn()
    }))
})

describe("MailgunMailStrategy", () => {
    const mailgunCtor = Mailgun as unknown as jest.Mock
    const create = jest.fn()
    const client = jest.fn()
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
        client.mockReturnValue({
            messages: {
                create
            }
        })
        mailgunCtor.mockImplementation(() => ({
            client
        }))
    })

    it("throws when setOptions receives incomplete config", () => {
        const strategy = new MailgunMailStrategy(mailOptions)

        expect(() =>
            strategy.setOptions({
                transport: "mailgun",
                apiKey: "",
                domain: "mg.example.com"
            })
        ).toThrow(new HttpException("Invalid Mailgun Configuration", 500))
    })

    it("sends a transformed Mailgun message after initialization", async () => {
        create.mockResolvedValue(undefined)

        const strategy = new MailgunMailStrategy(mailOptions)
        const mail = new TestMailable()

        strategy.setOptions({
            transport: "mailgun",
            apiKey: "api-key",
            domain: "mg.example.com"
        })

        await strategy.send(mail)

        expect(client).toHaveBeenCalledWith({
            username: "api",
            key: "api-key"
        })
        expect(create).toHaveBeenCalledWith("mg.example.com", {
            ...mail.getMailGunMessage(mailOptions.from),
            template: ""
        })
    })

    it("throws when send is called before initialization", async () => {
        const strategy = new MailgunMailStrategy(mailOptions)

        await expect(strategy.send(new TestMailable())).rejects.toThrow(
            new HttpException(
                "Mailgun not initialized. Did you forget to call setOptions?",
                500
            )
        )
    })

    it("resolves remote attachments before sending", async () => {
        create.mockResolvedValue(undefined)
        ;(axios.get as jest.Mock).mockResolvedValue({
            data: Uint8Array.from([1, 2, 3]).buffer
        })

        class RemoteAttachmentMail extends TestMailable {
            override getMailGunMessage(from: {
                address: string
                name: string
            }) {
                return {
                    ...super.getMailGunMessage(from),
                    attachment: [
                        {
                            data: "http://example.com/file.pdf",
                            filename: "file.pdf",
                            contentType: "application/pdf"
                        }
                    ]
                }
            }
        }

        const strategy = new MailgunMailStrategy(mailOptions)
        strategy.setOptions({
            transport: "mailgun",
            apiKey: "api-key",
            domain: "mg.example.com"
        })

        await strategy.send(new RemoteAttachmentMail())

        expect((axios.get as jest.Mock).mock.calls[0]).toEqual([
            "http://example.com/file.pdf",
            {
                responseType: "arraybuffer"
            }
        ])
        expect(create).toHaveBeenCalledWith("mg.example.com", {
            text: "Plain text body",
            html: undefined,
            from: "Sender Name <sender@example.com>",
            to: ["recipient@example.com"],
            cc: ["copy@example.com"],
            bcc: ["blind@example.com"],
            subject: "Welcome aboard",
            attachment: [
                {
                    data: Buffer.from(Uint8Array.from([1, 2, 3]).buffer),
                    filename: "file.pdf",
                    contentType: "application/pdf"
                }
            ],
            template: ""
        })
    })
})
