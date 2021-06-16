import { NewsletterDao } from './newsletterDao';
import { SubscriptionDao } from './subscriptionDao';

export const SUBSCRIPTION_REPOSITORY ='SUBSCRIPTION_REPOSITORY';
export const NEWSLETTER_REPOSITORY = 'NEWSLETTER_REPOSITORY';

export const DBProviders = [
  {
    provide: 'SUBSCRIPTION_REPOSITORY',
    useValue: SubscriptionDao,
  },
  {
    provide: 'NEWSLETTER_REPOSITORY',
    useValue: NewsletterDao,
  },
];
