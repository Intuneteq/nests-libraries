import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

type DemoTransporter = 'primary' | 'secondary' | 'fallback';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('mailables/basic')
  async sendBasicDemo(
    @Query('to') to?: string,
    @Query('transporter') transporter?: DemoTransporter,
  ): Promise<string> {
    return await this.appService.sendBasicTextDemo(to, transporter);
  }

  @Get('mailables/addresses')
  async sendAddressStructuresDemo(
    @Query('to') to?: string,
    @Query('transporter') transporter?: DemoTransporter,
  ): Promise<string> {
    return this.appService.sendAddressStructuresDemo(to, transporter);
  }

  @Get('mailables/envelope')
  async sendEnvelopeOptionsDemo(
    @Query('to') to?: string,
    @Query('transporter') transporter?: DemoTransporter,
  ): Promise<string> {
    return this.appService.sendEnvelopeOptionsDemo(to, transporter);
  }

  @Get('mailables/content/template')
  async sendTemplateContentDemo(
    @Query('to') to?: string,
    @Query('transporter') transporter?: DemoTransporter,
  ): Promise<string> {
    return this.appService.sendTemplateContentDemo(to, transporter);
  }

  @Get('mailables/attachments')
  async sendAttachmentsDemo(
    @Query('to') to?: string,
    @Query('transporter') transporter?: DemoTransporter,
  ): Promise<string> {
    return this.appService.sendAttachmentsDemo(to, transporter);
  }

  @Get('mailables/all')
  async sendAllDemos(
    @Query('to') to?: string,
    @Query('transporter') transporter?: DemoTransporter,
  ): Promise<string> {
    return this.appService.sendAllDemos(to, transporter);
  }
}
