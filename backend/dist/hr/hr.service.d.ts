import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { SmartworkingSession } from './entities/smartworking.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { ApprovalWorkflowService } from '../approvals/approval-workflow.service';
export declare class HrService {
    private readonly employeeRepo;
    private readonly timeRepo;
    private readonly leaveRepo;
    private readonly smartSessionRepo;
    private readonly events;
    private readonly tenantContext;
    private readonly approvalWorkflow;
    constructor(employeeRepo: Repository<Employee>, timeRepo: Repository<TimeEntry>, leaveRepo: Repository<LeaveRequest>, smartSessionRepo: Repository<SmartworkingSession>, events: EventBusService, tenantContext: TenantContextService, approvalWorkflow: ApprovalWorkflowService);
    listEmployees(limit?: number): Promise<Employee[]>;
    listTimeEntries(limit?: number, employeeId?: string): Promise<TimeEntry[]>;
    listSmartworkingSessions(limit?: number, employeeId?: string): Promise<SmartworkingSession[]>;
    createLeaveRequest(input: {
        employeeId: string;
        startDate: string;
        endDate: string;
        type: string;
    }): Promise<{
        tenantId: string;
        employee: Employee;
        startDate: string;
        endDate: string;
        type: string;
        status: "PENDING";
    } & LeaveRequest>;
    approveLeaveRequest(id: string, approvedBy?: string): Promise<LeaveRequest>;
    rejectLeaveRequest(id: string): Promise<LeaveRequest>;
    listLeaveRequests(limit?: number): Promise<LeaveRequest[]>;
    createEmployee(input: {
        code: string;
        fullName: string;
        email: string;
    }): Promise<{
        tenantId: string;
        code: string;
        fullName: string;
        email: string;
    } & Employee>;
    recordTimeEntry(input: {
        employeeId: string;
        clockIn: Date;
        clockOut?: Date;
    }): Promise<{
        tenantId: string;
        employee: Employee;
        clockIn: Date;
        clockOut: Date | undefined;
        status: "RECORDED";
    } & TimeEntry>;
    approveTimeEntry(id: string): Promise<TimeEntry>;
    createSmartworkingSession(input: {
        employeeId: string;
        date: string;
        deviceId?: string;
    }): Promise<{
        tenantId: string;
        employee: Employee;
        date: string;
        deviceId: string | undefined;
    } & SmartworkingSession>;
}
