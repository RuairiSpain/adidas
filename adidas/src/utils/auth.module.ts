import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [HeaderApiKeyStrategy],
})
export class AuthModule {}
