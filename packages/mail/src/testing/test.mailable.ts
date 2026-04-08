import { Attachment } from "../mailables/attachment"
import { Content } from "../mailables/content"
import { Envelope } from "../mailables/envelope"
import { Mailable } from "../mailables/mailable"
import { Header } from "../interface/messages.interface"

export class TestMailable extends Mailable {
    envelope(): Envelope {
        return new Envelope({
            to: "recipient@example.com",
            cc: "copy@example.com",
            bcc: "blind@example.com",
            replyTo: "reply@example.com",
            subject: "Welcome aboard"
        })
    }

    content(): Content {
        return new Content({
            text: "Plain text body"
        })
    }

    attachments(): Attachment[] {
        return [
            new Attachment({
                content: "hello world",
                filename: "welcome.txt",
                contentType: "text/plain",
                contentDisposition: "attachment"
            })
        ]
    }

    headers(): Header[] {
        return [{ key: "X-Trace-Id", value: "trace-123" }]
    }
}
