import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';
export declare class PerformanceGoal extends BaseEntityWithTenant {
    employee: Employee;
    description: string;
}
export declare class PerformanceReview extends BaseEntityWithTenant {
    employee: Employee;
    reviewDate: string;
    score: number;
}
