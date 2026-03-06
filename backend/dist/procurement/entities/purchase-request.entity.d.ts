import { BaseEntityWithTenant } from '../../core/database/base-entity';
export type PurchaseRequestStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
export declare class PurchaseRequest extends BaseEntityWithTenant {
    requesterId: string;
    itemId: string;
    quantity: string;
    estimatedValue?: string;
    status: PurchaseRequestStatus;
}
