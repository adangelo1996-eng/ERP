import { BaseEntityWithTenant } from '../database/base-entity';
export type WorkflowType = 'PR' | 'LEAVE' | 'TIME_ENTRY' | 'INVESTMENT';
export declare class ApprovalWorkflow extends BaseEntityWithTenant {
    type: WorkflowType;
    thresholdAmount?: string;
    approverRoles: string;
}
