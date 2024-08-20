import { NestFactory } from '@nestjs/core';
import { INestApplication, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +(configService.get<string>('LISTEN_PORT') as string);
  setupClassValidatorContainer(app);
  setupCrossOrigin(app);
  setupVersioning(app);
  setupSwaggerDocs(app);
  await app.listen(PORT);
}

function setupClassValidatorContainer(app: INestApplication) {
  //See https://github.com/nestjs/nest/issues/528 on how to use nestjs DI container
  // with class-validator. Credit goes to Julianomqs (https://github.com/julianomqs)
  // Use NestJst Container to inject dependencies into validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}

function setupCrossOrigin(app: INestApplication) {
  app.enableCors({ origin: true });
}

function setupSwaggerDocs(app: INestApplication) {
  const title = 'Askari Patrol System';
  const apiDescription =
    'A platform aimed at monitoring the performance of security guards while on duty. The days of tiptoeing on your security guards to know if they are alert are over. It is a thing of the past.';
  const apiVersion = '0.1.0';
  const swaggerUIUrl = 'docs';
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(apiDescription)
    .setVersion(apiVersion)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerUIUrl, app, document);
}
function setupVersioning(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
}

bootstrap();
