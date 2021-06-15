import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { BatchSpanProcessor } from '@opentelemetry/tracing';
import * as redisStore from 'cache-manager-redis-store';
import { Log4jsInterceptor, Log4jsModule } from 'nestjs-log4js';
import { AwsInstrumentation } from 'opentelemetry-instrumentation-aws-sdk';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.development.env';

const logger = new Logger('Adidas API Module', true);

logger.log('OpenTelemetry initialize contextManager');
const contextManager = new AsyncHooksContextManager();
contextManager.enable()
const scope1 = '1' as any;
contextManager.with(scope1, async () => {
    logger.log(`Before tick: contextManager is active: ${contextManager.active()}`);
    await (async () => { })()
    logger.log(`After tick: contextManager is active: ${contextManager.active()}`);
});

@Module({
  imports: [
    CacheModule.register({
       store: redisStore,
       host: 'backend.redis',
       ttl: 5, // seconds
       max: 10, // maximum number of items in cache
    }),

    ConfigModule.forRoot({ isGlobal: true, envFilePath }),

    Log4jsModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('LOG_LEVEL'),
      inject: [ConfigService],
    }),

    OpenTelemetryModule.register({
      spanProcessor: new BatchSpanProcessor(new JaegerExporter({
          endpoint: process.env.JAEGER_ENDPOINT,
          port: 14250,
          maxPacketSize: 65000
        }),
      ),
      contextManager: contextManager,
      instrumentations: [
          new ExpressInstrumentation(),
          new HttpInstrumentation({
              responseHook: (span, response) => {
                  span.setAttribute('http-response-status', response.statusCode);
              },
              ignoreIncomingPaths: [/\/metrics/, /\/health/, /\/login/]
          }),
          new AwsInstrumentation(),
          new PgInstrumentation(),
          new DnsInstrumentation(),
          new KafkaJsInstrumentation({
              producerHook: (span, topic, message) => {
                  span.setAttribute('producer-message-topic', topic);
                  span.setAttribute('producer-message-value', message.value);
              },
              consumerHook: (span, topic, message) => {
                  span.setAttribute('consumer-message-topic', topic);
                  span.setAttribute('consumer-message-value', message.value);
              },
          }),
          new SequelizeInstrumentation({
              responseHook: (span, response) => {
                  span.setAttribute('Sequelize Result', JSON.stringify(response));
              },
          }),
        ],
      }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HeaderApiKeyStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
