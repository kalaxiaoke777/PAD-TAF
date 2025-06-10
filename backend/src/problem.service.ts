import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './entity/problem.entity.js';
import { User } from './entity/user.entity.js';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async createProblem(data: any, user: any) {
    if (!user || !user.userId) {
      return { code: 401, message: '未授权或登录已失效' };
    }
    try {
      const problem = this.problemRepository.create({
        ...data,
        reporter: { id: user.userId },
      });
      await this.problemRepository.save(problem);
      return { code: 0, message: '上报成功' };
    } catch (e) {
      return { code: 500, message: '保存失败', error: e.message };
    }
  }

  async findAll(user?: any, query: any = {}) {
    // 超级管理员可查全部，普通用户仅查自己
    const qb = this.problemRepository
      .createQueryBuilder('problem')
      .leftJoinAndSelect('problem.reporter', 'reporter');
    if (!(user?.role === 'superadmin' || user?.role === 'admin')) {
      qb.andWhere('reporter.id = :userId', { userId: user.userId });
    }
    if (query.type) qb.andWhere('problem.type = :type', { type: query.type });
    if (query.description)
      qb.andWhere('problem.description LIKE :desc', {
        desc: `%${query.description}%`,
      });
    if (query.severity)
      qb.andWhere('problem.severity = :severity', { severity: query.severity });
    if (query.status)
      qb.andWhere('problem.status = :status', { status: query.status });
    if (query.reporter)
      qb.andWhere('reporter.username LIKE :reporter', {
        reporter: `%${query.reporter}%`,
      });
    if (query.startDate && query.endDate) {
      qb.andWhere('problem.createdAt BETWEEN :start AND :end', {
        start: query.startDate + ' 00:00:00',
        end: query.endDate + ' 23:59:59',
      });
    }
    qb.orderBy('problem.createdAt', 'DESC');
    const data = await qb.getMany();
    return { code: 0, data };
  }

  async findOne(id: number) {
    return this.problemRepository.findOne({
      where: { id },
      relations: ['reporter'],
    });
  }

  async updateStatus(id: number, status: string) {
    const problem = await this.problemRepository.findOne({ where: { id } });
    if (!problem) return { code: 1, message: '问题不存在' };
    problem.status = status;
    await this.problemRepository.save(problem);
    return { code: 0, message: '状态更新成功' };
  }

  async updateProblem(id: number, data: any, user: any) {
    const problem = await this.problemRepository.findOne({
      where: { id },
      relations: ['reporter'],
    });
    if (!problem) return { code: 1, message: '问题不存在' };
    if (
      user.role !== 'superadmin' &&
      user.role !== 'admin' &&
      problem.reporter.id !== user.userId
    ) {
      return { code: 2, message: '无权限修改' };
    }
    Object.assign(problem, data);
    await this.problemRepository.save(problem);
    return { code: 0, message: '修改成功' };
  }

  async deleteProblem(id: number, user: any) {
    const problem = await this.problemRepository.findOne({
      where: { id },
      relations: ['reporter'],
    });
    if (!problem) return { code: 1, message: '问题不存在' };
    if (
      user.role !== 'superadmin' &&
      user.role !== 'admin' &&
      problem.reporter.id !== user.userId
    ) {
      return { code: 2, message: '无权限删除' };
    }
    await this.problemRepository.remove(problem);
    return { code: 0, message: '删除成功' };
  }

  async aggregateStats() {
    // 按状态、类别、严重程度统计数量
    const statusStats = await this.problemRepository
      .createQueryBuilder('problem')
      .select('problem.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('problem.status')
      .getRawMany();
    const typeStats = await this.problemRepository
      .createQueryBuilder('problem')
      .select('problem.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('problem.type')
      .getRawMany();
    const severityStats = await this.problemRepository
      .createQueryBuilder('problem')
      .select('problem.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('problem.severity')
      .getRawMany();
    // 总数趋势，按天统计
    const totalTrend = await this.problemRepository
      .createQueryBuilder('problem')
      .select("TO_CHAR(problem.createdAt, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();
    // 总数
    const total = await this.problemRepository.count();
    return {
      code: 0,
      data: { statusStats, typeStats, severityStats, total, totalTrend },
    };
  }
}
