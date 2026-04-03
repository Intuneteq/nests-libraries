import { Mailable } from '../mailables/mailable'
import { MailClientOptions } from './config.interface'
import { MailGunMessage, SesMessage, SmtpMessage } from './messages.interface'

/**
 * Represents an email address with an optional display name.
 * Example: { address: "john@example.com", name: "John Doe" }
 */
export interface MailAddress {
  address: string
  name: string
}

/**
 * Union of all supported message types across providers.
 */
export type MailMessageUnion = SmtpMessage | SesMessage | MailGunMessage

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
 * Interface for services that can send raw provider-specific messages
 * (bypassing the Mailable abstraction).
 *
 * Typically used internally by strategies.
 */
export interface ISendableMessage {
  sendMessage(message: MailMessageUnion): Promise<void>
}

/**
 * Contract implemented by each provider strategy (SMTP, SES, Mailgun).
 * A strategy must:
 *  - Behave like an IMailService (send Mailables).
 *  - Be able to send raw messages (ISendableMessage).
 *  - Allow runtime configuration of transport options (IMailOptionsConfigurator).
 */
export interface MailStrategy extends IMailService, ISendableMessage, IMailOptionsConfigurator {}

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
