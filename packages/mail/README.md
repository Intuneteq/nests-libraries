# @intune/nestjs-mail

Reusable NestJS mail module with support for SMTP, AWS SES, and Mailgun.

## Install

```bash
pnpm add @intune/nestjs-mail @nestjs/common @nestjs/core @nestjs/config
```

Provider dependencies:

- SMTP: `nodemailer`
- SES: `@aws-sdk/client-sesv2`
- Mailgun: `mailgun.js`, `form-data`, and `axios`

## What It Exports

- `MailModule`
- `MailService`
- Mail config types
- Mailable helpers: `Address`, `Attachment`, `Content`, `Envelope`, `Mailable`

## Configure the Module

### `register`

```ts
import { Module } from "@nestjs/common"
import { MailModule } from "@intune/nestjs-mail"

@Module({
    imports: [
        MailModule.register({
            from: {
                address: "hello@example.com",
                name: "Example App"
            },
            default: "primary",
            clients: {
                primary: {
                    transport: "smtp",
                    host: "smtp.example.com",
                    port: 587,
                    encryption: "tls",
                    auth: {
                        user: "smtp-user",
                        pass: "smtp-password"
                    }
                }
            }
        })
    ]
})
export class AppModule {}
```

### `registerAsync`

```ts
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MailModule } from "@intune/nestjs-mail"

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                from: {
                    address: config.getOrThrow("MAIL_FROM_ADDRESS"),
                    name: config.get("MAIL_FROM_NAME") ?? "Example App"
                },
                default: "primary",
                clients: {
                    primary: {
                        transport: "ses",
                        region: config.getOrThrow("AWS_REGION"),
                        accessKeyId: config.getOrThrow("AWS_ACCESS_KEY_ID"),
                        secretAccessKey: config.getOrThrow(
                            "AWS_SECRET_ACCESS_KEY"
                        )
                    }
                }
            })
        })
    ]
})
export class AppModule {}
```

## Send Mail

```ts
import { Injectable } from "@nestjs/common"
import { MailService } from "@intune/nestjs-mail"

@Injectable()
export class NotificationsService {
    constructor(private readonly mailService: MailService) {}

    async send(mail: WelcomeEmail) {
        await this.mailService.send(mail)
    }
}
```

## Choose a Specific Client

```ts
const mailer = this.mailService.getTransporter("backup")
await mailer.send(new WelcomeEmail(user))
```

## Create a Mailable

```ts
import {
    Content,
    Envelope,
    Mailable
} from "@intune/nestjs-mail"

export class WelcomeEmail extends Mailable {
    constructor(
        private readonly user: {
            email: string
            name: string
        }
    ) {
        super()
    }

    envelope() {
        return new Envelope({
            to: this.user.email,
            subject: "Welcome"
        })
    }

    content() {
        return new Content({
            text: `Hello ${this.user.name}, welcome aboard.`
        })
    }

    attachments() {
        return []
    }

    headers() {
        return []
    }
}
```

## HTML Templates

`Content` resolves template views from `src/views` in the consuming application and supports `.html`, `.hbs`, and `.handlebars` files.

```ts
content() {
    return new Content({
        html: "emails.welcome",
        with: {
            name: this.user.name
        }
    })
}
```

That example resolves one of these files if it exists:

- `src/views/emails/welcome.html`
- `src/views/emails/welcome.hbs`
- `src/views/emails/welcome.handlebars`

## Supported Client Shapes

### SMTP

```ts
{
    transport: "smtp",
    host: "smtp.example.com",
    port: 587,
    encryption: "tls",
    auth: {
        user: "username",
        pass: "password"
    }
}
```

### SES

```ts
{
    transport: "ses",
    region: "eu-west-1",
    accessKeyId: "aws-access-key-id",
    secretAccessKey: "aws-secret-access-key"
}
```

### Mailgun

```ts
{
    transport: "mailgun",
    apiKey: "key-...",
    domain: "mg.example.com"
}
```

## Development

```bash
pnpm --filter @intune/nestjs-mail build
pnpm --filter @intune/nestjs-mail test
pnpm --filter @intune/nestjs-mail lint
```

## License
   MIT © Tobi Olanitori