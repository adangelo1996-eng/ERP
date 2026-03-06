import { BaseEntityWithTenant } from '../../core/database/base-entity';
export declare class FixedAsset extends BaseEntityWithTenant {
    code: string;
    name: string;
    acquisitionDate: string;
    acquisitionCost: string;
    usefulLifeMonths: number;
}
