import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor(private readonly configService: ConfigService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  public validate = (apiKey: string, done: (error: Error, data) => unknown) => {
    if (this.configService.get('API_KEY') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  };
}
