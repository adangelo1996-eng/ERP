import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { ProductionItem } from './production-item.entity';
import { WorkCenter } from './work-center.entity';
export declare class Routing extends BaseEntityWithTenant {
    item: ProductionItem;
    version: string;
    isActive: boolean;
    operations: Operation[];
}
export declare class Operation extends BaseEntityWithTenant {
    routing: Routing;
    workCenter: WorkCenter;
    sequence: number;
    setupTime: string;
    runTimePerUnit: string;
}
