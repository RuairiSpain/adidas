import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Adidas API Bootstrap', true);

  const app = await NestFactory.create(AppModule);

  /* Express middleware. */
  app.use(morgan('common'));
  app.use(helmet());
  app.enableCors();
  app.enableShutdownHooks();
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  logger.log(`Added middleware`);
  /* End of express middleware. */

  const config = new DocumentBuilder()
    .setTitle('Adidas Newsletter')
    .setDescription('Adidas Newsletter Subscription and Email')
    .setVersion('1.0')
    .addTag('subscription')
    .addTag('email')
    .setContact(
      'Adidas',
      'https://api-docs.addidas.com',
      'developer_support@addidas.com',
    )
    .addApiKey(
      { type: 'apiKey', name: 'Authorisation', in: 'header' },
      'X-API-KEY',
    )
    .build();

  logger.log(`Creating Swagger`);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  logger.log(`API listening on port 3000\n\n`);
  await app.listen(3000);
}

bootstrap();
