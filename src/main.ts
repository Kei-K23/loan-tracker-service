import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Setup Swagger
  const documentConfig = new DocumentBuilder()
    .setTitle('Loan Tracker Service')
    .setVersion('0.1.0')
    .setDescription(
      'The Loan Tracker Service API allows users to apply for loans, manage repayments, and track their loan status',
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);

  app.use(
    '/api-docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.enableCors(); // Enable Cors

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
