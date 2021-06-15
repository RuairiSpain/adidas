import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { SubscriptionGrpcService } from './app.controller';
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
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        host: config.get('DB_HOST'),
        autoLoadModels: true,
      }),
    }),
  ],
  controllers: [SubscriptionGrpcService],
  providers: [SubscriptionService],
})
export class AppModule {}
