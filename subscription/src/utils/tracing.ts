const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const opentelemetry = require('@opentelemetry/api');
const { context, getSpanContext } = require('@opentelemetry/api');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const log4js = require('log4js');
const { AwsInstrumentation } = require('opentelemetry-instrumentation-aws-sdk');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { DnsInstrumentation } = require('@opentelemetry/instrumentation-dns');
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');
const { SequelizeInstrumentation } = require('opentelemetry-instrumentation-sequelize');

const logger = log4js.getLogger("Tracing");
logger.level = "debug";

// Enable OpenTelemetry exporters to export traces to Grafan
const tracerProvider = new NodeTracerProvider();

registerInstrumentations({
    tracerProvider: tracerProvider,
    instrumentations: [
        new ExpressInstrumentation(),
        new HttpInstrumentation({
            responseHook: (span, response) => {
                span.setAttribute('http-response', response.body);
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
    ]
});

const options = {
    serviceName: process.env.OTEL_SERVICE_NAME,
    tags: [], // optional
    endpoint: process.env.OTEL_EXPORTER_JAEGER_ENDPOINT,
    maxPacketSize: 65000
}

tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter(options)));
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
tracerProvider.register();

export const tracer = opentelemetry.trace.getTracer(process.env.OTEL_SERVICE_NAME);

export const addTraceId = (req, res, next) => {
    const spanContext = getSpanContext(context.active());
    req.traceId = spanContext && spanContext.traceId;
    next();
};

logger.debug("Tracing initialized for %s sending span to %s", options.serviceName, options.endpoint);
