import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import {
  ApplicationEntity,
  PaginatedResponse,
} from './entities/application.entity';
import {
  Prisma,
  JobType as PrismaJobType,
  ApplicationStatus as PrismaStatus,
} from '@prisma/client';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto): Promise<ApplicationEntity> {
    const app = await this.prisma.application.create({
      data: {
        companyName: dto.companyName.toLowerCase(),
        jobTitle: dto.jobTitle.toLowerCase(),
        jobType: dto.jobType as PrismaJobType,
        status: dto.status as PrismaStatus,
        appliedDate: dto.appliedDate,
        notes: dto.notes ?? null,
      },
    });
    return app;
  }

  async findAll(
    query: QueryApplicationDto,
  ): Promise<PaginatedResponse<ApplicationEntity>> {
    const { status, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {};

    if (status) {
      where.status = status as PrismaStatus;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search.toLowerCase() } },
        { jobTitle: { contains: search.toLowerCase() } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: data.map((app) => app),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ApplicationEntity> {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found`);
    }

    return application;
  }

  async update(
    id: string,
    dto: UpdateApplicationDto,
  ): Promise<ApplicationEntity> {
    await this.findOne(id);

    const app = await this.prisma.application.update({
      where: { id },
      data: {
        companyName: dto.companyName,
        jobTitle: dto.jobTitle,
        jobType: dto.jobType !== undefined ? dto.jobType : undefined,
        status: dto.status !== undefined ? dto.status : undefined,
        appliedDate:
          dto.appliedDate !== undefined ? new Date(dto.appliedDate) : undefined,
        notes: dto.notes,
      },
    });

    return app;
  }

  async remove(id: string): Promise<ApplicationEntity> {
    await this.findOne(id);

    const app = await this.prisma.application.delete({
      where: { id },
    });

    return app;
  }
}
