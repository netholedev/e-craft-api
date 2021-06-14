import { Module } from '@nestjs/common';
import { PusherService } from '@lib/services';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PUSHER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'feed',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [PusherService],
  exports: [PusherService],
})
export class PusherModule {}
