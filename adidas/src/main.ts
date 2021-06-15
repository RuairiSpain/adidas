import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { Log4jsService } from 'nestjs-log4js';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  /* Express middleware. */
  app.useLogger(app.get(Log4jsService));
  app.use(morgan('common'));
  app.use(helmet());
  app.enableCors();
  app.enableShutdownHooks();
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
