import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ProblemType {
  SAFETY = '安全',
  ENVIRONMENT = '环境',
  ELECTRIC = '电器损坏',
  CANTEEN = '食堂',
  OFFICE = '办公',
  OTHER = '其他',
}

export enum ProblemSeverity {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高',
}

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ProblemType })
  type: ProblemType;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ProblemSeverity })
  severity: ProblemSeverity;

  @Column({ default: '待处理' })
  status: string;

  @ManyToOne(() => User)
  reporter: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];
}
