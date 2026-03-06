import { BaseEntityWithTenant } from '../database/base-entity';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export declare class ApprovalStep extends BaseEntityWithTenant {
    contextType: string;
    contextId: string;
    stepOrder: number;
    status: ApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
}
