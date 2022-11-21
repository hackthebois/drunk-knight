import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
	// Server Configuration
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
	app.enableCors();

	// Auth for Swagger
	// app.use(
	// 	['/docs', '/docs-json'],
	// 	basicAuth({
	// 		challenge: true,
	// 		users: {
	// 			[process.env.SWAGGER_USER ? process.env.SWAGGER_USER : '']:
	// 				process.env.SWAGGER_PASSWORD
	// 					? process.env.SWAGGER_PASSWORD
	// 					: '',
	// 		},
	// 	}),
	// );

	// Swagger UI Configuration
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Drunk Knight')
		.setDescription('DK API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			displayRequestDuration: true,
		},
	});

	// Starts Server
	await app.listen(process.env.PORT || 8000);
}
bootstrap();
