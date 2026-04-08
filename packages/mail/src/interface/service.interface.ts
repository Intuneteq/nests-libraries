import { Mailable } from "../mailables/mailable"
import { MailClientOptions } from "./config.interface"
/**
 * Represents an email address with an optional display name.
 * Example: { address: "john@example.com", name: "John Doe" }
 */
export interface MailAddress {
    address: string
    name: string
}

/**
 * Main service interface for sending mail.
 * - `from`: Default sender for the service.
 * - `send()`: Send a Mailable immediately.
 */
export interface IMailService {
    from: MailAddress
    send(mail: Mailable): Promise<void>
}

/**
 * Contract implemented by each provider strategy (SMTP, SES, Mailgun).
 * A strategy must:
 *  - Behave like an IMailService (send Mailables).
 *  - Allow runtime configuration of transport options (IMailOptionsConfigurator).
 */
export interface MailStrategy extends IMailService, IMailOptionsConfigurator {}

/**
 * Interface for updating or setting mail client options dynamically.
 * Useful for cases where provider credentials are rotated or
 * different configurations are needed at runtime.
 */
export interface IMailOptionsConfigurator {
    setOptions(options: MailClientOptions): MailStrategy
}

/**
 * Minimal common shape for mail messages, regardless of provider.
 * Useful for higher-level logic that doesn’t care about provider details.
 */
export interface IMailMessageBase {
    to: string | string[]
    subject: string
    text?: string
    html?: string
    from?: string
    attachments?: Array<{
        filename: string
        content: Buffer | string
    }>
}
