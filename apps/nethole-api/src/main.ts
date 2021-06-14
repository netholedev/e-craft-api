import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { PermissionsPrivateService } from '@lib/services';

import { NetholeApiModule } from './nethole-api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NetholeApiModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true,
    }),
  );

  app.enableCors({
    origin: '*',
  });

  const permissionsPrivateService = app.get(PermissionsPrivateService);

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRoute', async (opts) => {
      const route = { path: opts.url, method: opts.method };

      if (route.method !== 'OPTIONS') {
        await permissionsPrivateService.updateOrInsert(route, route);
        console.info(`[PERMISSION] [${route.method}] \t ${route.path}`);
      }
    });

  await app.listen(5000, '0.0.0.0', () => console.log('Nethole Api 🚀'));
}

bootstrap();
