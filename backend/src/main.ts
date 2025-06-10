import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

// 直接使用 Node.js 的 __dirname（commonjs 兼容写法）
const currentDir = __dirname;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // 前端开发端口，生产环境请修改
    credentials: true,
  });
  // 静态文件服务
  app.useStaticAssets(join(currentDir, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
