import {
  UnauthorizedException,
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.username,
        body.password,
      );
      return this.authService.login(user);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('登录失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
