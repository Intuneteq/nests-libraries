import {
    Attachment,
    Content,
    Envelope,
    type Header,
    Mailable
} from "@intune/nestjs-mail"

type TemplateContentMailData = {
    toEmail: string
    fullName: string
    email: string
    message: string
}

export class TemplateContentMail extends Mailable {
    constructor(private readonly data: TemplateContentMailData) {
        super()
    }

    public envelope(): Envelope {
        return new Envelope({
            to: this.data.toEmail,
            subject: "Template Content Demo"
        })
    }

    public content(): Content {
        return new Content({
            html: "mail.contact-us",
            with: {
                fullName: this.data.fullName,
                email: this.data.email,
                message: this.data.message
            }
        })
    }

    public attachments(): Attachment[] {
        return []
    }

    public headers(): Header[] {
        return [{ key: "X-Demo-Case", value: "template-content" }]
    }
}
