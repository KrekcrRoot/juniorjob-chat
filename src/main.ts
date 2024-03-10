import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('JuniorJob Chat API')
    .setDescription(
      'Заходят как-то аморал, нигилист и циник в бар. А бармен им:\n' +
        '\n' +
        '— У нас спиртное только с 18.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = Number(process.env.APP_PORT) || 8081;
  await app.listen(PORT);
}
bootstrap();
