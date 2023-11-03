import { NestFactory } from '@nestjs/core';
import { INestApplication, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupAPIVersioning(app);
  useNestJsDIContainerForClassValidation(app);
  setupSwaggerDocs(app);
  await app.listen(3000);
}
function useNestJsDIContainerForClassValidation(app: INestApplication) {
  //See https://github.com/nestjs/nest/issues/528 on how to use nestjs DI container
  // with class-validator. Credit goes to Julianomqs (https://github.com/julianomqs)
  // Use NestJst Container to inject dependencies into validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}

function setupSwaggerDocs(app: INestApplication) {
  const title = 'Guard Tour Systems';
  const apiDescription = 'Guard Tour Systems API Description';
  const apiVersion = '1.0.0';
  const docsUrl = 'docs';
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(apiDescription)
    .setVersion(apiVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsUrl, app, document);
}
function setupAPIVersioning(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
}
bootstrap();
