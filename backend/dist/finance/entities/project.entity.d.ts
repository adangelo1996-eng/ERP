import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { CostCenter } from './cost-center.entity';
export declare class Project extends BaseEntityWithTenant {
    code: string;
    name: string;
    costCenter?: CostCenter | null;
}
