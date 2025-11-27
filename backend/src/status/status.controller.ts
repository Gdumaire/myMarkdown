import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UpdateStatusDto } from './dto/update-status.dto';
import { LOGGER } from 'src/infra/logger/logger.module';
import type { ILoggerService } from 'src/infra/logger/logger-service/interface/logger-service.interface';

@Controller('status')
export class StatusController {
  constructor(@Inject(LOGGER) private logger: ILoggerService) {}

  @Get()
  getStatus(): string {
    this.logger.log('Fuck yes', 'plop');
    return 'OK';
  }

  @Get('yolo')
  getYolo(): string {
    return 'YOLO';
  }

  @Post('update')
  updateStatus(@Body() updateStatusDTO: UpdateStatusDto): string {
    return `Status updated to ${updateStatusDTO.status}`;
  }
}
