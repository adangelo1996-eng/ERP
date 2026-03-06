import { BaseEntityWithTenant } from '../../core/database/base-entity';
export declare class Contract extends BaseEntityWithTenant {
    code: string;
    title: string;
    startDate: string;
    endDate?: string;
}
