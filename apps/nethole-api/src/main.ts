import { contentParser } from 'fastify-multer';
import helmet from 'fastify-helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { PermissionsPrivateService } from '@lib/services';

import { NetholeApiModule } from './nethole-api.module';

const swaggerDocument = new DocumentBuilder()
  .setTitle('API')
  .setDescription('API')
  .setVersion('1.0')
  .addTag('API')
  .build();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NetholeApiModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true,
    }),
  );

  app.register(contentParser);

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  app.enableCors({
    origin: '*',
  });

  app.useStaticAssets({ root: 'uploads' });

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerDocument));

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
