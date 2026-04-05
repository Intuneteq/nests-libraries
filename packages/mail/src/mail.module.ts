import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailModuleAsyncOptions, MailModuleOptions } from './interface/config.interface'
import { CONFIG_OPTIONS } from './entities/config'
import { MailService } from './mail.service'
import { MAIL_STRATEGY } from './entities/strategies'
import { SmtpMailStrategy } from './strategies/smtp/smtp.service'
import { SesMailStrategy } from './strategies/ses/ses.service'
import { MailgunMailStrategy } from './strategies/mailgun/mailgun.service'

@Module({})
export class MailModule {
  /**
   * Synchronous registration of the MailModule.
   * Useful when configuration is available at module import time.
   */
  static register(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options
        },
        {
          provide: MAIL_STRATEGY.smtp,
          useClass: SmtpMailStrategy
        },
        {
          provide: MAIL_STRATEGY.ses,
          useClass: SesMailStrategy
        },
        {
          provide: MAIL_STRATEGY.mailgun,
          useClass: MailgunMailStrategy
        },
        MailService,
      ],
      exports: [MailService, CONFIG_OPTIONS, MAIL_STRATEGY.smtp, MAIL_STRATEGY.ses, MAIL_STRATEGY.mailgun]
    }
  }

  /**
   * Asynchronous registration of the MailModule.
   * Useful when configuration depends on async providers or other modules.
   */
  static registerAsync(options: MailModuleAsyncOptions): DynamicModule {
    return {
      module: MailModule,
      imports: [...(options.imports || [])],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        {
          provide: MAIL_STRATEGY.smtp,
          useClass: SmtpMailStrategy
        },
        {
          provide: MAIL_STRATEGY.ses,
          useClass: SesMailStrategy
        },
        {
          provide: MAIL_STRATEGY.mailgun,
          useClass: MailgunMailStrategy
        },
        MailService
      ],
      exports: [MailService, CONFIG_OPTIONS, MAIL_STRATEGY.smtp, MAIL_STRATEGY.ses, MAIL_STRATEGY.mailgun]
    }
  }
}
