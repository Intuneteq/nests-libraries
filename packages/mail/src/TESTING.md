**1. Core model tests**
Target the `mailables` and value objects first, because they’re deterministic and cheap to test.

Cover:
- `Address`, `Attachment`, `Content`, `Envelope`
- `Mailable#getSmtpMessage()`
- `Mailable#getSesMessage()`
- `Mailable#getMailGunMessage()`

Why this matters:
- This package’s real value is message transformation across providers.
- These tests give you high confidence without any network/client mocking complexity.

A good pattern is to create one small fake mail class just for tests, then assert the exact message shape produced for SMTP, SES, and Mailgun.

**2. Strategy unit tests**
Test each strategy class in isolation with mocked SDKs/clients.

Files to target:
- [smtp.service.ts](/Users/tobiolanitori/Documents/projects/nestjs-libraries/packages/mail/src/strategies/smtp.service.ts)
- [ses.service.ts](/Users/tobiolanitori/Documents/projects/nestjs-libraries/packages/mail/src/strategies/ses.service.ts)
- [mailgun.service.ts](/Users/tobiolanitori/Documents/projects/nestjs-libraries/packages/mail/src/strategies/mailgun.service.ts)

What to verify:
- `setOptions()` validates required config
- `send()` throws if not initialized
- `send()` calls the underlying provider with the transformed message
- provider errors are wrapped into Nest exceptions
- Mailgun attachment URL resolution behavior is handled correctly

Mock boundaries:
- `nodemailer.createTransport`
- `SESv2Client` / `send`
- `mailgun.js` client
- `axios.get` for Mailgun attachment downloads

These should be unit tests only, not real SMTP/SES/Mailgun integration tests.

**3. Service orchestration tests**
Then test [mail.service.ts](/Users/tobiolanitori/Documents/projects/nestjs-libraries/packages/mail/src/mail.service.ts) as the coordinator.

Focus on:
- invalid default transporter throws
- invalid client name throws
- `getTransporter()` selects the right strategy
- `send()` uses the configured default client
- selected strategy gets `setOptions()` and then `send()`

Here you should not use real strategy classes. Inject mock strategy providers and assert orchestration only.

**4. Module wiring tests**
Keep [mail.module.ts](/Users/tobiolanitori/Documents/projects/nestjs-libraries/packages/mail/src/mail.module.ts) tests small.

Just verify:
- `register()` returns the expected providers/exports
- `registerAsync()` wires factory options correctly
- a Nest testing module can import the package and resolve `MailService`

This layer is mostly DI smoke testing, not business logic.

**Recommended test structure**
I’d organize it like this:

- `packages/mail/src/mailables/*.spec.ts`
- `packages/mail/src/strategies/*.spec.ts`
- `packages/mail/src/mail.service.spec.ts`
- `packages/mail/src/mail.module.spec.ts`

If you want to keep source folders cleaner, use `packages/mail/test/` instead, but colocated specs are usually easier in a library this size.

**Test pyramid for this package**
Aim roughly for:
- 60% mailable/value-object tests
- 25% strategy unit tests
- 10% service tests
- 5% module wiring tests

That balance fits this package because the hardest-to-break and most reusable behavior is the provider-specific message generation.

**Practical setup note**
Right now `packages/mail/package.json` has a `test` script, but it doesn’t appear to include local Jest setup like `jest`, `ts-jest`, `@types/jest`, or `@nestjs/testing`. Since the repo already uses Jest in `apps/server`, the cleanest move is to reuse that stack for this package too and add a small Jest config for `packages/mail`.

If you want, I can take the next step and scaffold:
- a Jest config for `packages/mail`
- a reusable `TestMailable`
- one spec each for `MailService`, `MailModule`, and a strategy so you have the pattern for the rest