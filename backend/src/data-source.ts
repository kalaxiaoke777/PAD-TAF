import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Problem } from './entity/problem.entity';
import { User } from './entity/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'rld',
  entities: [Problem, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: true,
});
