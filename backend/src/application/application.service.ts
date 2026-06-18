import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import {
  ApplicationEntity,
  PaginatedResponse,
} from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>,
  ) {}

  async create(dto: CreateApplicationDto): Promise<ApplicationEntity> {
    const app = this.repo.create({
      companyName: dto.companyName.toLowerCase(),
      jobTitle: dto.jobTitle.toLowerCase(),
      jobType: dto.jobType as any,
      status: dto.status as any,
      appliedDate: dto.appliedDate as any,
      notes: dto.notes ?? null,
    });
    return this.repo.save(app);
  }

  async findAll(
    query: QueryApplicationDto,
  ): Promise<PaginatedResponse<ApplicationEntity>> {
    const { status, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (search) {
      const searchLower = search.toLowerCase();
      where.companyName = ILike(`%${searchLower}%`);
    }

    let qb = this.repo.createQueryBuilder('app');

    if (status) {
      qb = qb.andWhere('app.status = :status', { status: status.toUpperCase() });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      qb = qb.andWhere(
        '(LOWER(app.company_name) LIKE :search OR LOWER(app.job_title) LIKE :search)',
        { search: `%${searchLower}%` },
      );
    }

    const [data, total] = await qb
      .orderBy('app.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data as ApplicationEntity[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ApplicationEntity> {
    const application = await this.repo.findOneBy({ id });

    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found`);
    }

    return application as ApplicationEntity;
  }

  async update(
    id: string,
    dto: UpdateApplicationDto,
  ): Promise<ApplicationEntity> {
    await this.findOne(id);

    const updateData: any = {};
    if (dto.companyName !== undefined) updateData.companyName = dto.companyName;
    if (dto.jobTitle !== undefined) updateData.jobTitle = dto.jobTitle;
    if (dto.jobType !== undefined) updateData.jobType = dto.jobType;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.appliedDate !== undefined)
      updateData.appliedDate = new Date(dto.appliedDate);
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    await this.repo.update(id, updateData);

    return this.repo.findOneBy({ id }) as Promise<ApplicationEntity>;
  }

  async remove(id: string): Promise<ApplicationEntity> {
    const application = await this.findOne(id);

    await this.repo.delete(id);

    return application;
  }
}
