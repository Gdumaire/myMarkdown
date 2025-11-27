import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService:UsersService, private jwtService: JwtService) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmailAndPassword(username, pass);
        if (!user) {
            throw new Error("Dafuq bro");
        }
        console.log(user);
        return {
            access_token: await this.jwtService.signAsync({uuid:user.uuid})
        }
    }

    async signUp(username: string, pass:string):Promise<any> {
        return this.userService.createUser(username, pass);
    }
}
