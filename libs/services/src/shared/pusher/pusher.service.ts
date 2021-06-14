import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PusherService {
  constructor(@Inject('PUSHER_SERVICE') private client: ClientProxy) {}

  async onApplicationBootstrap() {
    // await this.client.connect();

    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3];

    setInterval(
      async () => console.log(await this.client.send<number>(pattern, data).toPromise()),
      3000,
    );
  }
}
