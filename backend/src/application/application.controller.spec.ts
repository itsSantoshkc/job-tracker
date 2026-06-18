import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';

describe('ApplicationController', () => {
  let controller: ApplicationController;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        ApplicationService,
        { provide: getRepositoryToken(Application), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
