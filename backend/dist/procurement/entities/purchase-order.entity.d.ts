import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Supplier } from './supplier.entity';
export type PurchaseOrderStatus = 'OPEN' | 'PARTIALLY_RECEIVED' | 'CLOSED' | 'CANCELLED';
export declare class PurchaseOrder extends BaseEntityWithTenant {
    supplier: Supplier;
    orderDate: string;
    status: PurchaseOrderStatus;
    lines: PurchaseOrderLine[];
}
export declare class PurchaseOrderLine extends BaseEntityWithTenant {
    order: PurchaseOrder;
    itemId: string;
    quantity: string;
    quantityReceived: string;
    unitPrice: string;
}
