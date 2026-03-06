import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Warehouse } from './warehouse.entity';
export declare class Location extends BaseEntityWithTenant {
    warehouse: Warehouse;
    code: string;
}
