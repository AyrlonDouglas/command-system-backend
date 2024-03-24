import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { swaggerStart } from './config/swagger.config';
import { AllExceptionsFilter } from './helper/filters/httpException.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerStart(app);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
}
bootstrap();
