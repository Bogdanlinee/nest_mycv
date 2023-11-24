import {Body, Controller, Patch, Delete, Get, Post, Param, Query, Session} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';
import {UsersService} from './users.service';
import {AuthService} from './auth.service';
import {UpdateUserDto} from './dtos/update-user.dto';
import {Serialize} from '../interceptors/serialize.interceptor';
import {UserDto} from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService) {
    }

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }

    @Get('/color')
    getColor(@Session() session: any) {
        return session.color;
    }

    @Post('/signup')
    createUser(@Body()
                   body: CreateUserDto
    ) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('/signin')
    signin(@Body()
               body: CreateUserDto
    ) {
        return this.authService.signin(body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id')
                 id: string
    ) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email')
                     email: string
    ) {
        return this.usersService.find(email);
    }

    @Patch('/:id')
    updateUser(@Param('id')
                   id: string, @Body()
                   body: UpdateUserDto
    ) {
        return this.usersService.update(parseInt(id), body);
    }

    @Delete(':id')
    removeUser(@Param('id')
                   id: string
    ) {
        return this.usersService.remove(parseInt(id));
    }
}
