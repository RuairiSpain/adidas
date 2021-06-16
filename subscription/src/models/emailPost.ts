/* eslint-disable prettier/prettier */
import { Newsletter } from './newsletter';
import { Subscription } from './subscription';

export class EmailPost {
  constructor(
    public subscription: Subscription,
    public newsletter: Newsletter,
  ) {}
}
