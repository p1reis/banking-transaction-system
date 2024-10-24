import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT, () =>
    Logger.log(`Listening in port ${process.env.PORT}`, 'NestApplication'),
  );
}
bootstrap();
