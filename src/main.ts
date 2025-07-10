import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (good for frontend dev/testing)
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API documentation for your URL Shortener service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Swagger at /docs

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
