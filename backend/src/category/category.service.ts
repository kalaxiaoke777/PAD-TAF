import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: number) {
    return this.categoryRepo.findOneBy({ id });
  }

  async create(data: Partial<Category>) {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async update(id: number, data: Partial<Category>) {
    await this.categoryRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.categoryRepo.delete(id);
  }
}
