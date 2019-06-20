import * as amqp from 'amqplib';
import {Server, CustomTransportStrategy} from '@nestjs/microservices';
import {Observable} from 'rxjs';

export class RabbitMQServer extends Server implements CustomTransportStrategy {
    private server: amqp.Connection = null;
    private channel: amqp.Channel = null;
    private requestChannel;
    private responseChannel;


    constructor(private readonly host: string,
                private readonly queue: string) {
        super();
        console.log('constructor')
    }

    public async sendSingleMessage(messageObj) {
        console.log('hey')

        await this.requestChannel.sendToQueue('queue1', Buffer.from(JSON.stringify(messageObj)));
        console.log('hey')

    }

    private async init() {
        try {
            this.server = await amqp.connect(this.host);
            this.requestChannel = await this.server.createChannel();
            this.responseChannel = await this.server.createChannel();
            this.responseChannel.assertQueue('queue2', {durable: false});
            this.requestChannel.assertQueue('queue1', {durable: false});
        } catch (e) {
            console.log('error')
        }
    }

    public async listen(callback: () => void) {
        await this.init()
        try {
            console.log('listen');
            this.responseChannel.consume(`queue2`, this.handleMessage.bind(this), {
                noAck: true,
            });
        } catch (e) {
            console.log('error')
        }
    }

    public close() {
        this.channel && this.channel.close();
        this.server && this.server.close();
    }

    private async handleMessage(message) {
        console.log('success');
        const {content} = message;
        const messageObj = JSON.parse(content.toString());
        setTimeout(() => {
            this.sendSingleMessage(content + '123');
        }, 40)
    }

    private sendMessage(message) {
        const buffer = Buffer.from(JSON.stringify(message));
        this.channel.sendToQueue(`${this.queue}_pub`, buffer);
    }
}