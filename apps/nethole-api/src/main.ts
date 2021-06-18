import { contentParser } from 'fastify-multer';
import helmet from 'fastify-helmet';
import { NestFactory } from '@nestjs/core';
import fastifyCookie from 'fastify-cookie';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

import { PermissionsPrivateService } from '@lib/services';

import { NetholeApiModule } from './nethole-api.module';
import { join } from 'path';

const swaggerDocument = new DocumentBuilder()
  .setTitle('Nethole API')
  .setDescription('REST API Documentation of nethole.dev services')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Authorization')
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

  app.enableCors({
    origin: '*',
  });

  app.register(fastifyCookie, {
    secret: 'A4frfdVaAddmmaaLASppos340',
  });

  app.useStaticAssets({ root: join(process.cwd(), 'uploads') });

  const customSwaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My API Docs',
  };

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerDocument),
    customSwaggerOptions,
  );

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

  await app.listen(8000, '0.0.0.0');
}

bootstrap()
  .then(() => console.log('Nethole Api 🚀'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
