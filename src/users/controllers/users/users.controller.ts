import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CreateUserDto } from '../../dtos/user.dto';
import { UsersService } from '../../services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync();
    createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.userService.getUserById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('victorious')
  async getMostWinningUsers() {
    return await this.userService.getUserVictories();
  }
}
