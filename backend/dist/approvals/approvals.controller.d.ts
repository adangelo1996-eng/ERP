import { ApprovalWorkflowService } from './approval-workflow.service';
export declare class ApprovalsController {
    private readonly approvalService;
    constructor(approvalService: ApprovalWorkflowService);
    listPending(): Promise<import("../core/entities/approval-step.entity").ApprovalStep[]>;
    approve(body: {
        contextType: string;
        contextId: string;
        approvedBy: string;
    }): Promise<import("../core/entities/approval-step.entity").ApprovalStep>;
}
