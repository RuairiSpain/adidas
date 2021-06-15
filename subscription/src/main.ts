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
        url: 'localhost:50055',
        package: 'subscription',
        protoPath: join(__dirname, 'models/subscription.proto'),
        loader: {
          keepCase: true,
          arrays: true,
          longs: String,
          enums: String,
          defaults: true,
        },
      },
    },
  );

  app.listen(() => console.log('Microservice is listening'));
}

bootstrap();
