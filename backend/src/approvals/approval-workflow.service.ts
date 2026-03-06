import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';
import { ApprovalStep } from '../core/entities/approval-step.entity';
import { TenantContextService } from '../core/tenant/tenant-context.service';

@Injectable()
export class ApprovalWorkflowService {
  constructor(
    @InjectRepository(ApprovalWorkflow)
    private readonly workflowRepo: Repository<ApprovalWorkflow>,
    @InjectRepository(ApprovalStep)
    private readonly stepRepo: Repository<ApprovalStep>,
    private readonly tenantContext: TenantContextService,
  ) {}

  async getWorkflowFor(type: string, amount?: number): Promise<ApprovalWorkflow | null> {
    const tenantId = this.tenantContext.getTenantId();
    const workflows = await this.workflowRepo.find({
      where: { tenantId, type: type as any },
      order: { thresholdAmount: 'ASC' },
    });
    if (workflows.length === 0) return null;
    const amt = amount ?? 0;
    for (const w of workflows) {
      const th = Number(w.thresholdAmount ?? 0);
      if (amt >= th) return w;
    }
    return null;
  }

  async requiresApproval(type: string, contextId: string, amount?: number): Promise<boolean> {
    const w = await this.getWorkflowFor(type, amount);
    if (!w) return false;
    const step = await this.stepRepo.findOne({
      where: { tenantId: this.tenantContext.getTenantId(), contextType: type, contextId },
    });
    return !step || step.status === 'PENDING';
  }

  async createPendingStep(type: string, contextId: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.stepRepo.save(
      this.stepRepo.create({
        tenantId,
        contextType: type,
        contextId,
        stepOrder: 1,
        status: 'PENDING',
      }),
    );
  }

  async approve(contextType: string, contextId: string, approvedBy: string) {
    const tenantId = this.tenantContext.getTenantId();
    const step = await this.stepRepo.findOneOrFail({
      where: { tenantId, contextType, contextId },
    });
    step.status = 'APPROVED';
    step.approvedBy = approvedBy;
    step.approvedAt = new Date();
    return this.stepRepo.save(step);
  }

  async listPending(limit = 50): Promise<ApprovalStep[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.stepRepo.find({
      where: { tenantId, status: 'PENDING' },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
