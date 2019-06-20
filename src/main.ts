import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {RabbitMQServer} from "./rabbitmq-server";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        strategy: new RabbitMQServer('amqp://localhost:5672', 'channel'),
    });
   await app.listen(() => {});
}

bootstrap();