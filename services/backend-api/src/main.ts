import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log', 'debug', 'verbose'] // Or configure based on NODE_ENV
  });
  const configService = app.get(ConfigService);

  const port = configService.get<number>('API_PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
    transform: true, // Automatically transform payloads to DTO instances
  }));

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  // TODO: Configure CORS more restrictively for production
  app.enableCors({
    origin: nodeEnv === 'development' ? '*' : configService.get<string>('FRONTEND_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger API Documentation (optional, but good for development)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Real-Time Support Dashboard API')
      .setDescription('API documentation for the customer support dashboard')
      .setVersion('1.0')
      .addBearerAuth() // If using JWT Bearer tokens
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    Logger.log(`Swagger UI available at http://localhost:${port}/api/docs`, 'Bootstrap');
  }

  await app.listen(port);
  Logger.log(`Application is running in ${nodeEnv} mode on: http://localhost:${port}/api/v1`, 'Bootstrap');
}
bootstrap();
