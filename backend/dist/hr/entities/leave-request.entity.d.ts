import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export declare class LeaveRequest extends BaseEntityWithTenant {
    employee: Employee;
    startDate: string;
    endDate: string;
    type: string;
    status: LeaveStatus;
}
