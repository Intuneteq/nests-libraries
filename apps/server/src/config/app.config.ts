import { registerAs } from '@nestjs/config';

type ENV = 'local' | 'development' | 'staging' | 'production';

export interface IApp {
  name: string;
  env: ENV;
  url: string;
  client_url: string;
  port: number;
}

export default registerAs(
  'app',
  (): IApp => ({
    name: process.env.APP_NAME || 'Test App',
    env: (process.env.NODE_ENV as ENV) || 'development',
    url: process.env.APP_URL || 'http://localhost',
    client_url: process.env.CLIENT_URL || 'https://localhost:3000',
    port: Number(process.env.PORT) || 5000,
  }),
);
