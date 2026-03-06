import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { FixedAsset } from './fixed-asset.entity';
export declare class DepreciationPlan extends BaseEntityWithTenant {
    asset: FixedAsset;
    startDate: string;
    endDate: string;
    totalAmount: string;
}
