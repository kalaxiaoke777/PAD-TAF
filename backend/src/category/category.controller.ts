import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../entity/category.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entity/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN)
  findAll(@Request() req) {
    console.log('user in findAll:', req.user);
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN)
  findOne(@Param('id') id: number, @Request() req) {
    console.log('user in findOne:', req.user);
    return this.categoryService.findOne(Number(id));
  }

  @Post()
  @Roles(UserRole.SUPERADMIN)
  create(@Body() data: Partial<Category>, @Request() req) {
    console.log('user in create:', req.user);
    return this.categoryService.create(data);
  }

  @Put(':id')
  @Roles(UserRole.SUPERADMIN)
  update(@Param('id') id: number, @Body() data: Partial<Category>, @Request() req) {
    console.log('user in update:', req.user);
    return this.categoryService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  remove(@Param('id') id: number, @Request() req) {
    console.log('user in remove:', req.user);
    return this.categoryService.remove(Number(id));
  }
}
