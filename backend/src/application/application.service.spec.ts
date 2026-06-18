import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Application } from './entities/application.entity';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let repo: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  const mockApp = {
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

  beforeEach(async () => {
    const mockQb = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockApp], 1]),
    };

    repo = {
      find: jest.fn().mockResolvedValue([mockApp]),
      findOneBy: jest.fn().mockResolvedValue(mockApp),
      save: jest.fn().mockResolvedValue(mockApp),
      create: jest.fn().mockReturnValue(mockApp),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      count: jest.fn().mockResolvedValue(1),
      createQueryBuilder: jest.fn().mockReturnValue(mockQb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: getRepositoryToken(Application), useValue: repo },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create with lowercase input', async () => {
      const dto = {
        companyName: 'Google',
        jobTitle: 'Software Engineer',
        jobType: 'FULL_TIME',
        status: 'APPLIED',
        appliedDate: '2026-06-15',
      };

      const result = await service.create(dto as any);
      expect(result).toEqual(mockApp);
      expect(repo.create).toHaveBeenCalledWith({
        companyName: 'google',
        jobTitle: 'software engineer',
        jobType: 'FULL_TIME',
        status: 'APPLIED',
        appliedDate: '2026-06-15',
        notes: null,
      });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated applications', async () => {
      const query = { page: 1, limit: 10 };
      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by status', async () => {
      await service.findAll({ page: 1, limit: 10, status: 'applied' });

      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single application', async () => {
      const result = await service.findOne('test-uuid-123');
      expect(result).toEqual(mockApp);
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOneBy.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an application', async () => {
      const result = await service.remove('test-uuid-123');
      expect(result).toEqual(mockApp);
      expect(repo.delete).toHaveBeenCalledWith('test-uuid-123');
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOneBy.mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
