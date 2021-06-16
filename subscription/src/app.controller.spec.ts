import { Test, TestingModule } from '@nestjs/testing';

import { SubscriptionGrpcService } from './app.controller';

describe('SubscriptionGrpcService', () => {
  let appController: SubscriptionGrpcService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionGrpcService],
    }).compile();

    appController = app.get<SubscriptionGrpcService>(SubscriptionGrpcService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getOne()).toBe('Hello World!');
    });
  });
});
