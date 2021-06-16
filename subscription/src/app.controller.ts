/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from 'grpc';

import { Subscription } from './models/subscription';
import { SubscriptionService } from './services/subscription.service';

@Controller()
export class SubscriptionGrpcService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @GrpcMethod()
  async create(
    data: Subscription,
    metadata: Metadata,
    call: ServerUnaryCall<any>,
  ) {
    const subscription = await this.subscriptionService.create(data);
    return subscription;
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
