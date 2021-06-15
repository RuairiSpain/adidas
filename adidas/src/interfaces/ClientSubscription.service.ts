import { Subscription } from '../models/subscription';

export interface ClientSubscriptionService {
  create(data: Subscription): Subscription;
  getAll(): Subscription[];
  getOne(data: ById): Subscription;
  update(data: Subscription): Subscription;
  delete(data: ById): ByCount;
}

interface ById {
  id: number;
}
interface ByCount {
  count: number;
}
