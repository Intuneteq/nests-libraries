import { HttpException, Inject, Injectable } from "@nestjs/common";

import { MailClientsMap, type MailModuleOptions, MailTransporter } from "./interface/config.interface";
import { IMailService, MailAddress, MailStrategy } from "./interface/service.interface";

import { CONFIG_OPTIONS } from "./entities/config";
import { MAIL_STRATEGY } from "./entities/strategies";

import { SesMailStrategy } from "./strategies/ses.service";
import { SmtpMailStrategy } from "./strategies/smtp.service";
import { MailgunMailStrategy } from "./strategies/mailgun.service";
import { Mailable } from "./mailables/mailable";

/**
 * Core MailService.
 * Provides a unified API to send or queue emails using different strategies (SMTP, SES, Mailgun).
 */
@Injectable()
export class MailService implements IMailService {
  public from: MailAddress;
  private default: keyof MailClientsMap;
  private clients: MailClientsMap;
  private strategyMap: Record<MailTransporter, MailStrategy>;

  constructor(
    @Inject(CONFIG_OPTIONS)
    protected options: MailModuleOptions,
    @Inject(MAIL_STRATEGY.ses)
    private readonly sesMailService: SesMailStrategy,
    @Inject(MAIL_STRATEGY.mailgun)
    private readonly mailgunMailService: MailgunMailStrategy,
    @Inject(MAIL_STRATEGY.smtp)
    private readonly smtpMailService: SmtpMailStrategy,
  ) {
    if (!options.default || !options.clients[options.default]) {
      throw new HttpException(`Invalid default transporter: ${options.default}`, 500);
    }
    this.default = options.default;
    this.clients = options.clients;
    this.strategyMap = {
      smtp: this.smtpMailService,
      ses: this.sesMailService,
      mailgun: this.mailgunMailService,
    };
  }

  /**
   * Send a Mailable immediately using the default transporter.
   */
  async send(mail: Mailable) {
    const transporter = this.getTransporter(this.default);
    await transporter.send(mail);
  }

  /**
   * Retrieve a configured transporter strategy for a given client name.
   */
  getTransporter(client: string): IMailService {
    const options = this.clients[client];
    if (!options) throw new HttpException("Invalid client", 500);
    const strategy = this.strategyMap[options.transport];
    return strategy.setOptions(options);
  }
}
