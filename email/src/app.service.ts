import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { INewsletter } from './interfaces/newsletter';
import { ISubscription } from './interfaces/subscription';

@Injectable()
export class AppService {
  constructor(private mailerService: MailerService) {}

  async sendMail(subscription: ISubscription, newsletter: INewsletter) {
    const url = `adidas.com/newsletter?promotion=${newsletter.token}`;

    await this.mailerService.sendMail({
      to: subscription.email,
      from: newsletter.from,
      subject: newsletter.title,
      template: newsletter.template,
      context: {
        name: subscription.firstname,
        url,
      },
    });
  }
}
