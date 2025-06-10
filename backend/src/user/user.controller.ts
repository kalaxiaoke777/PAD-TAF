import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { User, UserRole } from '../entity/user.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() body: { username: string; password: string; role?: UserRole },
  ) {
    try {
      const user = await this.userService.createUser(
        body.username,
        body.password,
        body.role,
      );
      return { success: true, user };
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException('用户名已存在');
      }
      throw new BadRequestException('注册失败');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() update: Partial<User>) {
    try {
      const user = await this.userService.updateUser(id, update);
      return { success: true, user };
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException('用户名已存在');
      }
      throw new BadRequestException('更新失败');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.userService.deleteUser(id);
    return { success: true };
  }
}
