import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity.js';
import { Problem } from './entity/problem.entity.js';
import { ProblemController } from './problem.controller.js';
import { ProblemService } from './problem.service.js';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_DATABASE || 'pad-taf',
      entities: [User, Problem],
      synchronize: false, // 开发环境自动建表，生产务必改回 false
      migrationsRun: true,
      migrations: ['dist/migrations/*.js'],
      autoLoadEntities: true,
      logging: true, // 启用SQL日志，便于调试静态资源等问题
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Problem]),
    CategoryModule,
  ],
  controllers: [AppController, ProblemController],
  providers: [AppService, ProblemService],
})
export class AppModule {}
