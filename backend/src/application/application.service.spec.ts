import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let prisma: {
    application: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  const mockPrismaApp = {
    id: 'test-uuid-123',
    companyName: 'Google',
    jobTitle: 'Software Engineer',
    jobType: 'FULL_TIME',
    status: 'APPLIED',
    appliedDate: new Date('2026-06-15'),
    notes: 'Test notes',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const expectedSerialized = {
    id: 'test-uuid-123',
    companyName: 'Google',
    jobTitle: 'Software Engineer',
    jobType: 'full_time',
    status: 'applied',
    appliedDate: new Date('2026-06-15'),
    notes: 'Test notes',
    createdAt: mockPrismaApp.createdAt,
    updatedAt: mockPrismaApp.updatedAt,
  };

  beforeEach(async () => {
    prisma = {
      application: {
        create: jest.fn().mockResolvedValue(mockPrismaApp),
        findMany: jest.fn().mockResolvedValue([mockPrismaApp]),
        findUnique: jest.fn().mockResolvedValue(mockPrismaApp),
        update: jest.fn().mockResolvedValue(mockPrismaApp),
        delete: jest.fn().mockResolvedValue(mockPrismaApp),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create with lowercase input and uppercase to DB', async () => {
      const dto = {
        companyName: 'Google',
        jobTitle: 'Software Engineer',
        jobType: 'full_time',
        status: 'applied',
        appliedDate: '2026-06-15',
      };

      const result = await service.create(dto);
      expect(result).toEqual(expectedSerialized);
      expect(prisma.application.create).toHaveBeenCalledWith({
        data: {
          companyName: 'Google',
          jobTitle: 'Software Engineer',
          jobType: 'FULL_TIME',
          status: 'APPLIED',
          appliedDate: '2026-06-15',
          notes: null,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated applications with lowercase status', async () => {
      const query = { page: 1, limit: 10 };
      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('applied');
      expect(result.data[0].jobType).toBe('full_time');
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by status (converts lowercase to uppercase for DB)', async () => {
      await service.findAll({ page: 1, limit: 10, status: 'applied' });

      expect(prisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'APPLIED' }),
        }),
      );
    });

    it('should search by company name or job title', async () => {
      await service.findAll({ page: 1, limit: 10, search: 'Google' });

      expect(prisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { companyName: { contains: 'Google' } },
              { jobTitle: { contains: 'Google' } },
            ],
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single application with lowercase status', async () => {
      const result = await service.findOne('test-uuid-123');
      expect(result).toEqual(expectedSerialized);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.application.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an application', async () => {
      const result = await service.remove('test-uuid-123');
      expect(result).toEqual(expectedSerialized);
      expect(prisma.application.delete).toHaveBeenCalledWith({
        where: { id: 'test-uuid-123' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.application.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
