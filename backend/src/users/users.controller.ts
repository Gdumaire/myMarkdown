import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UserDTO } from './dto/UserDTO';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post('sign-up')
    async signUpUser(@Body() userDTO: UserDTO) {
        if (userDTO.username && userDTO.password) {
            const user = await this.userService.createUser(userDTO.username, userDTO.password);
            console.log(user);
        }
    }

    @Get()
    async getUser(@Body() userDTO: UserDTO) {
        if (userDTO.username && userDTO.password) {
            return this.userService.getUserByEmailAndPassword(userDTO.username, userDTO.password);
        } 
        else
        if (userDTO.uuid) {
            return this.userService.getUserById(userDTO.uuid);
        }
    }
}
