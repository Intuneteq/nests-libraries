import {
    Attachment,
    Content,
    Envelope,
    type Header,
    Mailable
} from "@intune/nestjs-mail"

export class AttachmentsShowcaseMail extends Mailable {
    constructor(
        private readonly toEmail: string,
        private readonly otp: string,
        private readonly expiresInMinutes: number
    ) {
        super()
    }

    public envelope(): Envelope {
        return new Envelope({
            to: this.toEmail,
            subject: "Attachments Demo"
        })
    }

    public content(): Content {
        return new Content({
            text: `This email demonstrates attachment creation patterns. OTP: ${this.otp}`
        })
    }

    public attachments(): Attachment[] {
        const generatedText = new Attachment({
            filename: "otp.txt",
            contentType: "text/plain",
            contentDisposition: "attachment",
            content: `Your OTP is ${this.otp}. It expires in ${this.expiresInMinutes} minutes.`
        })

        const inlineBadge = new Attachment()
            .withFilename("badge.txt")
            .withContentType("text/plain")
            .withDisposition("inline")
            .withCid("otp-badge")
            .withContent("Inline badge content for CID: otp-badge")

        return [generatedText, inlineBadge]
    }

    public headers(): Header[] {
        return [{ key: "X-Demo-Case", value: "attachments" }]
    }
}
