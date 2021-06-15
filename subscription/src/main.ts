import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: process.env.SUBSCRIPTION_PACKAGE,
        protoPath: join(__dirname, 'models/subscription.proto'),
      },
    },
  );

  app.listen(() => console.log('Microservice is listening'));
}

bootstrap();