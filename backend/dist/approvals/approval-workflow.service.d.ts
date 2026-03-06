import { Repository } from 'typeorm';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';
import { ApprovalStep } from '../core/entities/approval-step.entity';
import { TenantContextService } from '../core/tenant/tenant-context.service';
export declare class ApprovalWorkflowService {
    private readonly workflowRepo;
    private readonly stepRepo;
    private readonly tenantContext;
    constructor(workflowRepo: Repository<ApprovalWorkflow>, stepRepo: Repository<ApprovalStep>, tenantContext: TenantContextService);
    getWorkflowFor(type: string, amount?: number): Promise<ApprovalWorkflow | null>;
    requiresApproval(type: string, contextId: string, amount?: number): Promise<boolean>;
    createPendingStep(type: string, contextId: string): Promise<ApprovalStep>;
    approve(contextType: string, contextId: string, approvedBy: string): Promise<ApprovalStep>;
    listPending(limit?: number): Promise<ApprovalStep[]>;
}
