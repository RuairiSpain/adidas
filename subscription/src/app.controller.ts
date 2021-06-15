import { Body, Controller, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from 'grpc';

import { EmailPost } from './models/emailPost';
import { Subscription } from './models/subscription';
import { SubscriptionService } from './services/subscription.service';


@Controller()
export class SubscriptionGrpcService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'email',
        brokers: ['kafka.kafka:9092'],
      },
      consumer: {
        groupId: 'email-consumer',
      },
    },
  })
  client: ClientKafka;

  constructor(private readonly subscriptionService: SubscriptionService) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('send.email');
    await this.client.connect();
  }

  @GrpcMethod()
  async create(
    data: Subscription,
    metadata: Metadata,
    call: ServerUnaryCall<any>,
  ) {

    const subscription = await this.subscriptionService.create(data);
    const post = new EmailPost(subscription, subscription.newsletter);
    return this.client.send('send.email', post);
  }

  @GrpcMethod()
  async getAll(data: void, metadata: Metadata, call: ServerUnaryCall<any>) {
    return this.subscriptionService.getAll();
  }

  @GrpcMethod()
  async getOne(data: number, metadata: Metadata, call: ServerUnaryCall<any>) {
    return this.subscriptionService.getOne(data);
  }

  @GrpcMethod()
  async update(
    data: Subscription,
    metadata: Metadata,
    call: ServerUnaryCall<any>,
  ) {
    return this.subscriptionService.update(data.id, data);
  }

  @GrpcMethod()
  async delete(data: number, metadata: Metadata, call: ServerUnaryCall<any>) {
    return this.subscriptionService.delete(data);
  }
}
