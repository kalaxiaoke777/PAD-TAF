import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entity/user.entity.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    username: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    // 检查重名
    const exist = await this.userRepository.findOne({ where: { username } });
    if (exist) {
      throw new ConflictException('用户名已存在');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hash, role });
    return this.userRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return undefined;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(
    id: number,
    update: Partial<User>,
  ): Promise<User | undefined> {
    if (update.username) {
      // 检查重名
      const exist = await this.userRepository.findOne({
        where: { username: update.username },
      });
      if (exist && exist.id !== id) {
        throw new ConflictException('用户名已存在');
      }
    }
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    await this.userRepository.update(id, update);
    return this.findById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
