"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const time_entry_entity_1 = require("./entities/time-entry.entity");
const leave_request_entity_1 = require("./entities/leave-request.entity");
const smartworking_entity_1 = require("./entities/smartworking.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
const approval_workflow_service_1 = require("../approvals/approval-workflow.service");
let HrService = class HrService {
    employeeRepo;
    timeRepo;
    leaveRepo;
    smartSessionRepo;
    events;
    tenantContext;
    approvalWorkflow;
    constructor(employeeRepo, timeRepo, leaveRepo, smartSessionRepo, events, tenantContext, approvalWorkflow) {
        this.employeeRepo = employeeRepo;
        this.timeRepo = timeRepo;
        this.leaveRepo = leaveRepo;
        this.smartSessionRepo = smartSessionRepo;
        this.events = events;
        this.tenantContext = tenantContext;
        this.approvalWorkflow = approvalWorkflow;
    }
    async listEmployees(limit = 100) {
        const tenantId = this.tenantContext.getTenantId();
        return this.employeeRepo.find({
            where: { tenantId },
            order: { code: 'ASC' },
            take: limit,
        });
    }
    async listTimeEntries(limit = 50, employeeId) {
        const tenantId = this.tenantContext.getTenantId();
        const where = { tenantId };
        if (employeeId)
            where.employee = { id: employeeId };
        return this.timeRepo.find({
            where,
            order: { clockIn: 'DESC' },
            take: limit,
            relations: ['employee'],
        });
    }
    async listSmartworkingSessions(limit = 50, employeeId) {
        const tenantId = this.tenantContext.getTenantId();
        const where = { tenantId };
        if (employeeId)
            where.employee = { id: employeeId };
        return this.smartSessionRepo.find({
            where,
            order: { date: 'DESC' },
            take: limit,
            relations: ['employee'],
        });
    }
    async createLeaveRequest(input) {
        const tenantId = this.tenantContext.getTenantId();
        const employee = await this.employeeRepo.findOneByOrFail({
            id: input.employeeId,
            tenantId,
        });
        const saved = await this.leaveRepo.save({
            tenantId,
            employee,
            startDate: input.startDate,
            endDate: input.endDate,
            type: input.type,
            status: 'PENDING',
        });
        await this.approvalWorkflow.createPendingStep('LEAVE', saved.id);
        return saved;
    }
    async approveLeaveRequest(id, approvedBy) {
        const tenantId = this.tenantContext.getTenantId();
        const req = await this.leaveRepo.findOneByOrFail({ id, tenantId });
        req.status = 'APPROVED';
        const saved = await this.leaveRepo.save(req);
        try {
            await this.approvalWorkflow.approve('LEAVE', id, approvedBy || 'system');
        }
        catch {
        }
        return saved;
    }
    async rejectLeaveRequest(id) {
        const tenantId = this.tenantContext.getTenantId();
        const req = await this.leaveRepo.findOneByOrFail({ id, tenantId });
        req.status = 'REJECTED';
        return this.leaveRepo.save(req);
    }
    async listLeaveRequests(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.leaveRepo.find({
            where: { tenantId },
            order: { startDate: 'DESC' },
            take: limit,
            relations: ['employee'],
        });
    }
    async createEmployee(input) {
        const tenantId = this.tenantContext.getTenantId();
        return this.employeeRepo.save({
            ...input,
            tenantId,
        });
    }
    async recordTimeEntry(input) {
        const tenantId = this.tenantContext.getTenantId();
        const employee = await this.employeeRepo.findOneByOrFail({
            id: input.employeeId,
            tenantId,
        });
        const entry = await this.timeRepo.save({
            tenantId,
            employee,
            clockIn: input.clockIn,
            clockOut: input.clockOut,
            status: 'RECORDED',
        });
        await this.events.publish({
            name: 'TimeEntryRecorded',
            occurredAt: new Date(),
            tenantId,
            payload: { timeEntryId: entry.id },
        });
        return entry;
    }
    async approveTimeEntry(id) {
        const tenantId = this.tenantContext.getTenantId();
        const entry = await this.timeRepo.findOneByOrFail({ id, tenantId });
        entry.status = 'APPROVED';
        const saved = await this.timeRepo.save(entry);
        await this.events.publish({
            name: 'TimeEntryApproved',
            occurredAt: new Date(),
            tenantId,
            payload: { timeEntryId: saved.id },
        });
        return saved;
    }
    async createSmartworkingSession(input) {
        const tenantId = this.tenantContext.getTenantId();
        const employee = await this.employeeRepo.findOneByOrFail({
            id: input.employeeId,
            tenantId,
        });
        const session = await this.smartSessionRepo.save({
            tenantId,
            employee,
            date: input.date,
            deviceId: input.deviceId,
        });
        await this.events.publish({
            name: 'SmartworkingSessionCreated',
            occurredAt: new Date(),
            tenantId,
            payload: { sessionId: session.id },
        });
        return session;
    }
};
exports.HrService = HrService;
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(time_entry_entity_1.TimeEntry)),
    __param(2, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(smartworking_entity_1.SmartworkingSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService,
        approval_workflow_service_1.ApprovalWorkflowService])
], HrService);
//# sourceMappingURL=hr.service.js.map