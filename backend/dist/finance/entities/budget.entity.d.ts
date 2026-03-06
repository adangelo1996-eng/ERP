import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { CostCenter } from './cost-center.entity';
import { Project } from './project.entity';
export declare class Budget extends BaseEntityWithTenant {
    year: number;
    costCenter?: CostCenter | null;
    project?: Project | null;
    amount: string;
}
