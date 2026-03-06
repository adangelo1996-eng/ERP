import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';
import { ApprovalStep } from '../core/entities/approval-step.entity';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { ApprovalsController } from './approvals.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprovalWorkflow, ApprovalStep]),
  ],
  providers: [ApprovalWorkflowService],
  controllers: [ApprovalsController],
  exports: [ApprovalWorkflowService],
})
export class ApprovalsModule {}
