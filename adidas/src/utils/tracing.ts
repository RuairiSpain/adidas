import opentelemetry from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import log4js from 'log4js';
import { AwsInstrumentation } from 'opentelemetry-instrumentation-aws-sdk';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';

const logger = log4js.getLogger('Tracing');
logger.level = 'debug';

// Enable OpenTelemetry exporters to export traces to Grafan
const tracerProvider = new NodeTracerProvider();

registerInstrumentations({
  tracerProvider: tracerProvider,
  instrumentations: [
    new ExpressInstrumentation(),
    new HttpInstrumentation({
      responseHook: (span, response) => {
        span.setAttribute('http-status-code', response.statusCode);
      },
      ignoreIncomingPaths: [/\/metrics/, /\/health/, /\/login/],
    }),
    new AwsInstrumentation(),
    new PgInstrumentation(),
    new DnsInstrumentation(),
    new KafkaJsInstrumentation({
      producerHook: (span, topic, message) => {
        span.setAttribute('producer-message-topic', topic);
        span.setAttribute('producer-message-value', message.value as string);
      },
      consumerHook: (span, topic, message) => {
        span.setAttribute('consumer-message-topic', topic);
        span.setAttribute('consumer-message-value', message.value as string);
      },
    }),
    new SequelizeInstrumentation({
      responseHook: (span, response) => {
        span.setAttribute('Sequelize Result', JSON.stringify(response));
      },
    }),
  ],
});

const options = {
  serviceName: process.env.OTEL_SERVICE_NAME,
  tags: [], // optional
  endpoint: process.env.OTEL_EXPORTER_JAEGER_ENDPOINT,
  maxPacketSize: 65000,
};

tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(new JaegerExporter(options)),
);

// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
tracerProvider.register();

export const tracer = opentelemetry.trace.getTracer(
  process.env.OTEL_SERVICE_NAME,
);

logger.debug(
  'Tracing initialized for %s sending span to %s',
  options.serviceName,
  options.endpoint,
);
