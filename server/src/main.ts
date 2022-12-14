import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

	// Starts Server and enable cors
	app.enableCors();
	await app.listen(process.env.PORT || 8000);
}
bootstrap();
