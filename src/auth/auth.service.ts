import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users/users.service';
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    const compare = bcrypt.compareSync(pass, user.password);
    if (user && compare) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      id: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_KEY,
      }),
    };
  }
}
