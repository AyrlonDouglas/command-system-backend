import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerTheme } from 'swagger-themes';

const config = new DocumentBuilder()
  .setTitle('Command System')
  .setDescription('System to controll of commands')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const options: SwaggerCustomOptions = {
  explorer: true,
  customCss: new SwaggerTheme('v3').getBuffer('dark'),
  customSiteTitle: 'Command System Docs',
};
export function swaggerStart(app: INestApplication) {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
}
