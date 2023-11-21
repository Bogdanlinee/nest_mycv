import {Controller, Post, Body} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
    @Post('/signup')
    creteUser(@Body() body: CreateUserDto) {
        console.log(body);
    }
}

