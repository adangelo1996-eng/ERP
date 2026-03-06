import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { ProductionItem } from './production-item.entity';
import { Operation } from './routing.entity';
export type ManufacturingOrderStatus = 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export declare class ManufacturingOrder extends BaseEntityWithTenant {
    item: ProductionItem;
    quantity: string;
    dueDate: string;
    status: ManufacturingOrderStatus;
    operations: MOOperation[];
}
export declare class MOOperation extends BaseEntityWithTenant {
    mo: ManufacturingOrder;
    operation: Operation;
    status: 'PLANNED' | 'IN_PROGRESS' | 'DONE';
    quantityCompleted: string;
}
