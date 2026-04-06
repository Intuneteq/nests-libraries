import { MailService } from "@intune/nestjs-mail"
import { Injectable } from "@nestjs/common"
import { AddressStructuresMail } from "./mails/address-structures.mail"
import { AttachmentsShowcaseMail } from "./mails/attachments-showcase.mail"
import { EnvelopeOptionsMail } from "./mails/envelope-options.mail"
import { TestMail } from "./mails/test.mail"
import { TemplateContentMail } from "./mails/template-content.mail"

type DemoTransporter = "primary" | "secondary" | "fallback"

@Injectable()
export class AppService {
    constructor(private readonly mailService: MailService) {}

    private readonly defaultDemoRecipient = "demo@example.com"

    private async sendMail(
        mail:
            | TestMail
            | AddressStructuresMail
            | EnvelopeOptionsMail
            | TemplateContentMail
            | AttachmentsShowcaseMail,
        transporter?: DemoTransporter
    ): Promise<void> {
        if (!transporter) {
            await this.mailService.send(mail)
            return
        }

        await this.mailService.getTransporter(transporter).send(mail)
    }

    private normalizeRecipient(recipient?: string): string {
        return recipient?.trim() || this.defaultDemoRecipient
    }

    getHello(): string {
        return "NestJS Mail demo server is running. Visit /mailables/* endpoints."
    }

    async sendBasicTextDemo(
        recipient?: string,
        transporter?: DemoTransporter
    ): Promise<string> {
        const to = this.normalizeRecipient(recipient)
        await this.sendMail(new TestMail(to, "123456"), transporter)
        return `Sent basic text demo to ${to}${transporter ? ` with ${transporter}` : ""}.`
    }

    async sendAddressStructuresDemo(
        recipient?: string,
        transporter?: DemoTransporter
    ): Promise<string> {
        const to = this.normalizeRecipient(recipient)
        await this.sendMail(new AddressStructuresMail(to), transporter)
        return `Sent address structures demo to ${to}${transporter ? ` with ${transporter}` : ""}.`
    }

    async sendEnvelopeOptionsDemo(
        recipient?: string,
        transporter?: DemoTransporter
    ): Promise<string> {
        const to = this.normalizeRecipient(recipient)
        await this.sendMail(new EnvelopeOptionsMail(to), transporter)
        return `Sent envelope options demo to ${to}${transporter ? ` with ${transporter}` : ""}.`
    }

    async sendTemplateContentDemo(
        recipient?: string,
        transporter?: DemoTransporter
    ): Promise<string> {
        const to = this.normalizeRecipient(recipient)
        await this.sendMail(
            new TemplateContentMail({
                toEmail: to,
                fullName: "Ada Lovelace",
                email: "ada@example.com",
                message: "Please send me details about your programs."
            }),
            transporter
        )

        return `Sent template content demo to ${to}${transporter ? ` with ${transporter}` : ""}.`
    }

    async sendAttachmentsDemo(
        recipient?: string,
        transporter?: DemoTransporter
    ): Promise<string> {
        const to = this.normalizeRecipient(recipient)
        await this.sendMail(
            new AttachmentsShowcaseMail(to, "837421", 5),
            transporter
        )
        return `Sent attachments demo to ${to}${transporter ? ` with ${transporter}` : ""}.`
    }

    async sendAllDemos(
        recipient?: string,
        transporter?: DemoTransporter
    ): Promise<string> {
        const to = this.normalizeRecipient(recipient)
        await this.sendBasicTextDemo(to, transporter)
        await this.sendAddressStructuresDemo(to, transporter)
        await this.sendEnvelopeOptionsDemo(to, transporter)
        await this.sendTemplateContentDemo(to, transporter)
        await this.sendAttachmentsDemo(to, transporter)
        return `Sent all mailable demos to ${to}${transporter ? ` with ${transporter}` : ""}.`
    }
}
