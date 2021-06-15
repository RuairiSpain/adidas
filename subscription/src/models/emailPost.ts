import { Newsletter } from './newsletter';
import { Subscription } from './Subscription';

export class EmailPost {
  constructor(
    public subscription: Subscription,
    public newsletter: Newsletter,
  ) {}
}
