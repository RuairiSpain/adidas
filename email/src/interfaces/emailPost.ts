import { INewsletter } from './newsletter';
import { ISubscription } from './subscription';

export interface IEmailPost {
  subscription: ISubscription;
  newsletter: INewsletter;
}
