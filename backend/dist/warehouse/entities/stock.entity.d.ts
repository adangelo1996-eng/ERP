import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Location } from './location.entity';
export declare class StockItem extends BaseEntityWithTenant {
    location: Location;
    itemId: string;
    batch?: string;
    quantity: string;
}
