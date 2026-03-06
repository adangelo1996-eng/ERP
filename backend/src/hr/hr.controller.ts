import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HrService } from './hr.service';
import { Roles } from '../core/auth/roles.decorator';
import { RecordTimeEntryDto } from './dto/record-time-entry.dto';

@Controller('hr')
export class HrController {
  constructor(private readonly hr: HrService) {}

  @Get('employees')
  @Roles('HR_MANAGER')
  listEmployees() {
    return this.hr.listEmployees();
  }

  @Get('time-entries')
  listTimeEntries(@Query('employeeId') employeeId?: string) {
    return this.hr.listTimeEntries(50, employeeId);
  }

  @Get('smartworking-sessions')
  listSmartworkingSessions(@Query('employeeId') employeeId?: string) {
    return this.hr.listSmartworkingSessions(50, employeeId);
  }

  @Get('leave-requests')
  listLeaveRequests() {
    return this.hr.listLeaveRequests();
  }

  @Post('leave-requests')
  createLeaveRequest(
    @Body()
    body: { employeeId: string; startDate: string; endDate: string; type: string },
  ) {
    return this.hr.createLeaveRequest(body);
  }

  @Patch('leave-requests/:id/approve')
  @Roles('HR_MANAGER')
  approveLeaveRequest(@Param('id') id: string) {
    return this.hr.approveLeaveRequest(id);
  }

  @Patch('leave-requests/:id/reject')
  @Roles('HR_MANAGER')
  rejectLeaveRequest(@Param('id') id: string) {
    return this.hr.rejectLeaveRequest(id);
  }

  @Post('employees')
  @Roles('HR_MANAGER')
  createEmployee(
    @Body()
    body: {
      code: string;
      fullName: string;
      email: string;
    },
  ) {
    return this.hr.createEmployee(body);
  }

  @Post('time-entries')
  recordTimeEntry(
    @Body()
    body: RecordTimeEntryDto,
  ) {
    return this.hr.recordTimeEntry({
      employeeId: body.employeeId,
      clockIn: new Date(body.clockIn),
      clockOut: body.clockOut ? new Date(body.clockOut) : undefined,
    });
  }

  @Patch('time-entries/:id/approve')
  approveTimeEntry(@Param('id') id: string) {
    return this.hr.approveTimeEntry(id);
  }

  @Post('smartworking-sessions')
  createSmartworkingSession(
    @Body()
    body: {
      employeeId: string;
      date: string;
      deviceId?: string;
    },
  ) {
    return this.hr.createSmartworkingSession(body);
  }
}

