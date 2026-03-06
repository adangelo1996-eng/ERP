import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { SmartworkingSession } from './entities/smartworking.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { ApprovalWorkflowService } from '../approvals/approval-workflow.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(TimeEntry)
    private readonly timeRepo: Repository<TimeEntry>,
    @InjectRepository(LeaveRequest)
    private readonly leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(SmartworkingSession)
    private readonly smartSessionRepo: Repository<SmartworkingSession>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
    private readonly approvalWorkflow: ApprovalWorkflowService,
  ) {}

  async listEmployees(limit = 100) {
    const tenantId = this.tenantContext.getTenantId();
    return this.employeeRepo.find({
      where: { tenantId },
      order: { code: 'ASC' },
      take: limit,
    });
  }

  async listTimeEntries(limit = 50, employeeId?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const where: any = { tenantId };
    if (employeeId) where.employee = { id: employeeId };
    return this.timeRepo.find({
      where,
      order: { clockIn: 'DESC' },
      take: limit,
      relations: ['employee'],
    });
  }

  async listSmartworkingSessions(limit = 50, employeeId?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const where: any = { tenantId };
    if (employeeId) where.employee = { id: employeeId };
    return this.smartSessionRepo.find({
      where,
      order: { date: 'DESC' },
      take: limit,
      relations: ['employee'],
    });
  }

  async createLeaveRequest(input: {
    employeeId: string;
    startDate: string;
    endDate: string;
    type: string;
  }) {
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

  async approveLeaveRequest(id: string, approvedBy?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const req = await this.leaveRepo.findOneByOrFail({ id, tenantId });
    req.status = 'APPROVED';
    const saved = await this.leaveRepo.save(req);
    try {
      await this.approvalWorkflow.approve('LEAVE', id, approvedBy || 'system');
    } catch {
      // step may not exist
    }
    return saved;
  }

  async rejectLeaveRequest(id: string) {
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

  async createEmployee(input: {
    code: string;
    fullName: string;
    email: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    return this.employeeRepo.save({
      ...input,
      tenantId,
    });
  }

  async recordTimeEntry(input: {
    employeeId: string;
    clockIn: Date;
    clockOut?: Date;
  }) {
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

  async approveTimeEntry(id: string) {
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

  async createSmartworkingSession(input: {
    employeeId: string;
    date: string;
    deviceId?: string;
  }) {
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
}

