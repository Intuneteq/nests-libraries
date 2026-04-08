import * as nodemailer from "nodemailer"
import { HttpException, Inject, Injectable } from "@nestjs/common"

import {
    type MailModuleOptions,
    SmtpMailOptions
} from "../../interface/config.interface"
import { MailStrategy, MailAddress } from "../../interface/service.interface"

import { Mailable } from "../../mailables/mailable"
import { CONFIG_OPTIONS } from "../../entities/config"

/**
 * Strategy for sending emails via SMTP using Nodemailer.
 * Implements MailStrategy to support sending, queueing, and runtime configuration.
 */
@Injectable()
export class SmtpMailStrategy implements MailStrategy {
    private transporter: nodemailer.Transporter
    private options: SmtpMailOptions
    public from: MailAddress

    constructor(@Inject(CONFIG_OPTIONS) protected _options: MailModuleOptions) {
        this.from = _options.from
    }

    /**
     * Configure SMTP transport at runtime.
     * Must provide host, port, and authentication credentials.
     */
    setOptions(options: SmtpMailOptions): MailStrategy {
        if (
            !options.host ||
            !options.port ||
            !options.auth.pass ||
            !options.auth.user
        )
            throw new HttpException("Smtp config not set", 500)

        this.options = options
        this.transporter = nodemailer.createTransport(options)
        return this
    }

    /**
     * Send a Mailable instance immediately via SMTP.
     */
    async send(mail: Mailable) {
        if (!this.transporter) {
            throw new HttpException("SMTP configuration not set", 500)
        }

        try {
            await this.transporter.verify()
            await this.transporter.sendMail(mail.getSmtpMessage(this.from))
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to send Mailgun message"

            throw new HttpException(message, 500)
        }
    }
}
