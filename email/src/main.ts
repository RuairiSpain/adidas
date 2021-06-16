import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka:19092'],
        },
        consumer: {
          groupId: 'email-consumer',
        },
      },
    },
  );

  await app.listen(() => console.log('Email service is listening...'));
}
bootstrap();
