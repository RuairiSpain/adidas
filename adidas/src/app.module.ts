import { LoggerService, OpenTelemetryModule, TraceService } from '@metinseylan/nestjs-opentelemetry';
import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { BatchSpanProcessor } from '@opentelemetry/tracing';
import { AwsInstrumentation } from 'opentelemetry-instrumentation-aws-sdk';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeaderApiKeyStrategy } from './utils/auth-header-api-key.strategy';
import { AuthModule } from './utils/auth.module';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.development.env';

const logger = new Logger('Adidas API Module', true);

logger.log('OpenTelemetry initialize contextManager');
const contextManager = new AsyncHooksContextManager();
contextManager.enable();
const scope1 = '1' as any;
contextManager.with(scope1, async () => {
  logger.log(
    `Before tick: contextManager is active: ${contextManager.active()}`,
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // await (async () => {})();
  logger.log(
    `After tick: contextManager is active: ${contextManager.active()}`,
  );
});

@Module({
  imports: [
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'backend.redis',
    //   ttl: 5, // seconds
    //   max: 10, // maximum number of items in cache
    // }),

    ClientsModule.register([
      {
        name: 'subscription-service',
        options: {
          transport: Transport.GRPC,
          url: 'subscription-service',
          package: 'subscription',
          protoPath: join(__dirname, 'hero/hero.proto'),
          loader: {
            keepCase: true,
            arrays: true,
            longs: String,
            enums: String,
            defaults: true,
          },
        },
      },
    ]),

    ConfigModule.forRoot({ isGlobal: true }),

    AuthModule,

    OpenTelemetryModule.register({
      spanProcessor: new BatchSpanProcessor(
        new JaegerExporter({
          endpoint: 'tempo',
          port: 14250,
          maxPacketSize: 65000,
        }),
      ),
      contextManager: contextManager,
      instrumentations: [
        new ExpressInstrumentation(),
        new HttpInstrumentation({
          responseHook: (span, response) => {
            span.setAttribute('http-response-status', response.statusCode);
          },
          ignoreIncomingPaths: [/\/metrics/, /\/health/, /\/login/],
        }),
        new AwsInstrumentation(),
        new PgInstrumentation(),
        new DnsInstrumentation(),
        new KafkaJsInstrumentation({
          producerHook: (span, topic, message) => {
            span.setAttribute('producer-message-topic', topic);
            span.setAttribute(
              'producer-message-value',
              message.value as string,
            );
          },
          consumerHook: (span, topic, message) => {
            span.setAttribute('consumer-message-topic', topic);
            span.setAttribute(
              'consumer-message-value',
              message.value as string,
            );
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
    TraceService,
    LoggerService,
    HeaderApiKeyStrategy,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
