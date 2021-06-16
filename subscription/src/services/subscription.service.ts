import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Sequelize } from 'sequelize-typescript';

import { NEWSLETTER_REPOSITORY } from '../models/db.providers';
import { SUBSCRIPTION_REPOSITORY } from '../models/db.providers';
import { NewsletterDao } from '../models/newsletterDao';
import { Subscription } from '../models/subscription';
import { SubscriptionDao } from '../models/subscriptionDao';

@Injectable()
export class SubscriptionService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'email',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'email-consumer',
      },
    },
  })
  client: ClientKafka;

  constructor(
    private sequelize: Sequelize,

    @Inject(SUBSCRIPTION_REPOSITORY)
    private subscriptionRepository: typeof SubscriptionDao,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('send.email');
    await this.client.connect();
  }

  async create(subscription: Subscription) {
    return this.sequelize.transaction(async (transaction) => {
      const post = await this.subscriptionRepository.create(
        subscription as SubscriptionDao,
        {
          transaction,
          include: NewsletterDao,
          raw: true,
          // @ts-ignore
          nest: true,
        },
      );

      if (!post) {
        throw new Error(
          'Cannot create subscription, check subscription values',
        );
      }

      if (!post.newsletter) {
        throw new RangeError(
          'Cannot create subscription, check newsletter identifier is valid',
        );
      }

      await this.client.send('send.email', post);
      return post;
    });
  }

  async getAll() {
    return this.sequelize.transaction(async (transaction) => {
      return this.subscriptionRepository.findAll({
        raw: true,
        transaction,
      });
    });
  }

  async getOne(id: number) {
    return this.sequelize.transaction(async (transaction) => {
      return (await this.subscriptionRepository.findByPk(id, {
        transaction,
      })) as Subscription;
    });
  }

  async update(id: number, subscription: Subscription) {
    return this.sequelize.transaction(async (transaction) => {
      const result = await this.subscriptionRepository.update(subscription, {
        where: { id },
        transaction,
        returning: true,
      });

      // Update returns an array shaped like [rowCount, Array<rows>]
      // If there are one or more rows then return the first one only
      if (result[0]) {
        return { ...result[1][0] } as Subscription;
      }

      return null;
    });
  }

  async delete(id: number) {
    const count = await this.sequelize.transaction(async (transaction) => {
      return this.subscriptionRepository.destroy({
        where: { id },
        transaction,
      });
    });

    return { count };
  }
}
