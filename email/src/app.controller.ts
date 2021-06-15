import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { IEmailPost } from './interfaces/emailPost';
import { IKafkaMessage } from './interfaces/kafkaMessage';


@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @MessagePattern('send.post')
  addPost(@Payload() message: IKafkaMessage<IEmailPost>) {
    return this.service.sendMail(message.value.subscription, message.value.newsletter);
  }
}