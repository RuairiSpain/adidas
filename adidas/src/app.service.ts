import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';

import { ClientSubscriptionService } from './interfaces/ClientSubscription.service';
import { Subscription } from './models/subscription';
import { grpcClientOptions } from './utils/grpc.options';

@Injectable()
export class AppService implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private svc: ClientSubscriptionService;

  onModuleInit() {
    // Setup the grpc stub interface to talk to the GRPC server
    this.svc = this.client.getService<ClientSubscriptionService>(
      'subscription-service',
    );
  }

  create(data: Subscription) {
    return this.svc.create(data);
  }

  getOne(id: number) {
    return this.svc.getOne({ id });
  }

  getAll() {
    return this.svc.getAll();
  }

  update(data: Subscription) {
    return this.svc.update(data);
  }

  async delete(id: number) {
    return (await this.svc.delete({ id }))?.count;
  }
}
