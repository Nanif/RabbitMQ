import {Controller, Get} from "@nestjs/common";

@Controller('user')
export class RabbitMQController {
    constructor(props) {
    }

    @Get('getUser')
    getUser() {
        console.log('arivewjkdfjk')
    }
}