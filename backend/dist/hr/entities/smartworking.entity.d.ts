import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';
export declare class SmartworkingPolicy extends BaseEntityWithTenant {
    name: string;
    maxDaysPerWeek: number;
}
export declare class SmartworkingSession extends BaseEntityWithTenant {
    employee: Employee;
    date: string;
    deviceId?: string;
}
