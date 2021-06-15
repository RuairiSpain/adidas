import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { NewsletterDao } from 'src/models/NewsletterDao';

import { Subscription } from '../models/subscription';
import { SubscriptionDao } from '../models/subscriptionDao';

@Injectable()
export class SubscriptionService {
  constructor(
    private sequelize: Sequelize,

    @Inject() private subscriptionRepository: typeof SubscriptionDao,
  ) {}

  async create(subscription: Subscription) {
    return this.sequelize.transaction(async (transaction) => {
      return this.subscriptionRepository.create(
        subscription as SubscriptionDao,
        {
          transaction,
          include: NewsletterDao,
          raw: true,
          // @ts-ignore
          nest: true,
        },
      );
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
