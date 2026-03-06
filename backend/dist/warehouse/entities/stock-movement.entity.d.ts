import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Location } from './location.entity';
export type StockMovementType = 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT';
export declare class StockMovement extends BaseEntityWithTenant {
    type: StockMovementType;
    fromLocation: Location;
    toLocation?: Location | null;
    itemId: string;
    batch?: string;
    quantity: string;
}
