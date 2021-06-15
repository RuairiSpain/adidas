import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'subscription-service:50055',
    package: 'subscription',
    protoPath: join(__dirname, '../models/subscription.proto'),
    loader: {
      keepCase: true,
      arrays: true,
      longs: String,
      enums: String,
      defaults: true,
    },
  },
};
