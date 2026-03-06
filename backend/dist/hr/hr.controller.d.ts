import { HrService } from './hr.service';
import { RecordTimeEntryDto } from './dto/record-time-entry.dto';
export declare class HrController {
    private readonly hr;
    constructor(hr: HrService);
    listEmployees(): Promise<import("./entities/employee.entity").Employee[]>;
    listTimeEntries(employeeId?: string): Promise<import("./entities/time-entry.entity").TimeEntry[]>;
    listSmartworkingSessions(employeeId?: string): Promise<import("./entities/smartworking.entity").SmartworkingSession[]>;
    listLeaveRequests(): Promise<import("./entities/leave-request.entity").LeaveRequest[]>;
    createLeaveRequest(body: {
        employeeId: string;
        startDate: string;
        endDate: string;
        type: string;
    }): Promise<{
        tenantId: string;
        employee: import("./entities/employee.entity").Employee;
        startDate: string;
        endDate: string;
        type: string;
        status: "PENDING";
    } & import("./entities/leave-request.entity").LeaveRequest>;
    approveLeaveRequest(id: string): Promise<import("./entities/leave-request.entity").LeaveRequest>;
    rejectLeaveRequest(id: string): Promise<import("./entities/leave-request.entity").LeaveRequest>;
    createEmployee(body: {
        code: string;
        fullName: string;
        email: string;
    }): Promise<{
        tenantId: string;
        code: string;
        fullName: string;
        email: string;
    } & import("./entities/employee.entity").Employee>;
    recordTimeEntry(body: RecordTimeEntryDto): Promise<{
        tenantId: string;
        employee: import("./entities/employee.entity").Employee;
        clockIn: Date;
        clockOut: Date | undefined;
        status: "RECORDED";
    } & import("./entities/time-entry.entity").TimeEntry>;
    approveTimeEntry(id: string): Promise<import("./entities/time-entry.entity").TimeEntry>;
    createSmartworkingSession(body: {
        employeeId: string;
        date: string;
        deviceId?: string;
    }): Promise<{
        tenantId: string;
        employee: import("./entities/employee.entity").Employee;
        date: string;
        deviceId: string | undefined;
    } & import("./entities/smartworking.entity").SmartworkingSession>;
}
