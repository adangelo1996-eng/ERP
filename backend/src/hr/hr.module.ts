import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalsModule } from '../approvals/approvals.module';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { Employee } from './entities/employee.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import {
  SmartworkingPolicy,
  SmartworkingSession,
} from './entities/smartworking.entity';
import {
  PerformanceGoal,
  PerformanceReview,
} from './entities/performance.entity';

@Module({
  imports: [
    ApprovalsModule,
    TypeOrmModule.forFeature([
      Employee,
      TimeEntry,
      LeaveRequest,
      SmartworkingPolicy,
      SmartworkingSession,
      PerformanceGoal,
      PerformanceReview,
    ]),
  ],
  providers: [HrService],
  controllers: [HrController],
  exports: [HrService],
})
export class HrModule {}

