import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { LOGGER } from 'src/infra/logger/logger.module';
import type { ILoggerService } from 'src/infra/logger/logger-service/interface/logger-service.interface';

describe('StatusController', () => {
  let controller: StatusController;
  let mockLogger: jest.Mocked<ILoggerService>;

  beforeEach(async () => {
    // Create a mock logger implementing ILoggerService interface
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: LOGGER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger.log on getStatus', () => {
    controller.getStatus();
    expect(mockLogger.log).toHaveBeenCalledWith('Fuck yes', 'plop');
  });
});
