import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import appConfig from "./config/app.config"
import { MailModule } from "@intune/nestjs-mail"
import mailConfig, { mailConfigAsync } from "./config/mail.config"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, mailConfig]
        }),
        MailModule.registerAsync(mailConfigAsync)
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
