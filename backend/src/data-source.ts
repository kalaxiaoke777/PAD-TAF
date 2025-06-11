import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Problem } from './entity/problem.entity';
import { User } from './entity/user.entity';
import { Category } from './entity/category.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'enterprise_info_management',
  entities: [Problem, User, Category],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
});
