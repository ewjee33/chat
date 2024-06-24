import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const http = require('http');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  http.globalAgent.keepAlive = true;
  await app.listen(process.env.PORTNUMBER || 10004);
}
bootstrap();
