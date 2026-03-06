import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { Roles } from '../core/auth/roles.decorator';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalService: ApprovalWorkflowService) {}

  @Get('pending')
  @Roles('FINANCE_MANAGER', 'PROCUREMENT_MANAGER', 'HR_MANAGER', 'INVESTMENT_MANAGER')
  listPending() {
    return this.approvalService.listPending();
  }

  @Patch('approve')
  @Roles('FINANCE_MANAGER', 'PROCUREMENT_MANAGER', 'HR_MANAGER', 'INVESTMENT_MANAGER')
  approve(@Body() body: { contextType: string; contextId: string; approvedBy: string }) {
    return this.approvalService.approve(body.contextType, body.contextId, body.approvedBy);
  }
}
