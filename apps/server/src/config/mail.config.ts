import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import {
  type MailModuleAsyncOptions,
  type MailModuleOptions,
} from '@intune/nestjs-mail';

export default registerAs(
  'mail',
  (): MailModuleOptions => ({
    from: {
      address: process.env.MAIL_FROM_ADDRESS || '',
      name: process.env.MAIL_FROM_NAME || '',
    },
    default: process.env.DEFAULT_MAILER || 'primary',
    clients: {
      primary: {
        transport: 'smtp',
        host: process.env.SMTP_HOST || '',
        port: 587,
        auth: {
          user: process.env.SMTP_EMAIL || '',
          pass: process.env.SMTP_PASSWORD || '',
        },
      },
      secondary: {
        transport: 'ses',
        region: '',
        accessKeyId: '',
        secretAccessKey: '',
      },
      fallback: {
        transport: 'mailgun',
        apiKey: process.env.MAILGUN_API_KEY || '',
        domain: process.env.MAILGUN_DOMAIN || '',
      },
    },
  }),
);

export const mailConfigAsync: MailModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return configService.getOrThrow<MailModuleOptions>('mail');
  },
  inject: [ConfigService],
};
