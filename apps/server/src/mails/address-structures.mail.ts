import {
    Address,
    Attachment,
    Content,
    Envelope,
    type Header,
    Mailable
} from "@intune/nestjs-mail"

export class AddressStructuresMail extends Mailable {
    constructor(private readonly toEmail: string) {
        super()
    }

    public envelope(): Envelope {
        return new Envelope({
            to: [
                this.toEmail,
                new Address("product.team@example.com", "Product Team")
            ],
            cc: new Address("ops.lead@example.com", "Ops Lead"),
            bcc: [
                "audit@example.com",
                new Address("security@example.com", "Security")
            ],
            replyTo: [
                new Address("support@example.com", "Support"),
                "helpdesk@example.com"
            ],
            subject: "Address Structures Demo"
        })
    }

    public content(): Content {
        return new Content({
            text: "This mail demonstrates string, Address object, and array recipient structures."
        })
    }

    public attachments(): Attachment[] {
        return []
    }

    public headers(): Header[] {
        return [{ key: "X-Demo-Case", value: "addresses" }]
    }
}
