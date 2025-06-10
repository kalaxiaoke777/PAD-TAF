import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProblemService } from './problem.service.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  // 用 any 替代 Express.Multer.File[] 以兼容类型
  async uploadImages(@UploadedFiles() files: { images?: any[] }) {
    const urls = (files.images || []).map((f) => `/uploads/${f.filename}`);
    return { code: 0, message: '上传成功', data: urls };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() body: any,
    @Request() req,
    @UploadedFiles() files: { images?: any[] },
  ) {
    const imageUrls = (files.images || []).map((f) => `/uploads/${f.filename}`);
    return this.problemService.createProblem(
      { ...body, images: imageUrls },
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query) {
    return this.problemService.findAll(req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.problemService.aggregateStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.problemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.problemService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any, @Request() req) {
    return this.problemService.updateProblem(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.problemService.deleteProblem(id, req.user);
  }
}
