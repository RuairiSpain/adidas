import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { SubscriptionGrpcService } from './app.controller';
import { DBProviders } from './models/db.providers';
import { SubscriptionService } from './services/subscription.service';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.development.env';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        host: config.get('POSTGRES_HOST'),
        autoLoadModels: true,
      }),
    }),
  ],
  controllers: [SubscriptionGrpcService],
  providers: [SubscriptionService, ...DBProviders],
  exports: [SubscriptionService],
})
export class AppModule {}
