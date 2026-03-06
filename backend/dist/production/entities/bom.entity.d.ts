import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { ProductionItem } from './production-item.entity';
export declare class BillOfMaterial extends BaseEntityWithTenant {
    parentItem: ProductionItem;
    version: string;
    isActive: boolean;
    components: BOMComponent[];
}
export declare class BOMComponent extends BaseEntityWithTenant {
    bom: BillOfMaterial;
    componentItemId: string;
    quantity: string;
}
