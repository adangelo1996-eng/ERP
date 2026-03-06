import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';
export type TimeEntryStatus = 'RECORDED' | 'APPROVED' | 'REJECTED';
export declare class TimeEntry extends BaseEntityWithTenant {
    employee: Employee;
    clockIn: Date;
    clockOut?: Date | null;
    status: TimeEntryStatus;
}
