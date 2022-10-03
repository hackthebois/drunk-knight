import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Drunk Knight')
		.setDescription('DK API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
  	SwaggerModule.setup('api', app, document);

	app.enableCors();
	await app.listen(8000);
}
bootstrap();
