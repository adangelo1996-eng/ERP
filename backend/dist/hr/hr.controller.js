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
exports.HrController = void 0;
const common_1 = require("@nestjs/common");
const hr_service_1 = require("./hr.service");
const roles_decorator_1 = require("../core/auth/roles.decorator");
const record_time_entry_dto_1 = require("./dto/record-time-entry.dto");
let HrController = class HrController {
    hr;
    constructor(hr) {
        this.hr = hr;
    }
    listEmployees() {
        return this.hr.listEmployees();
    }
    listTimeEntries(employeeId) {
        return this.hr.listTimeEntries(50, employeeId);
    }
    listSmartworkingSessions(employeeId) {
        return this.hr.listSmartworkingSessions(50, employeeId);
    }
    listLeaveRequests() {
        return this.hr.listLeaveRequests();
    }
    createLeaveRequest(body) {
        return this.hr.createLeaveRequest(body);
    }
    approveLeaveRequest(id) {
        return this.hr.approveLeaveRequest(id);
    }
    rejectLeaveRequest(id) {
        return this.hr.rejectLeaveRequest(id);
    }
    createEmployee(body) {
        return this.hr.createEmployee(body);
    }
    recordTimeEntry(body) {
        return this.hr.recordTimeEntry({
            employeeId: body.employeeId,
            clockIn: new Date(body.clockIn),
            clockOut: body.clockOut ? new Date(body.clockOut) : undefined,
        });
    }
    approveTimeEntry(id) {
        return this.hr.approveTimeEntry(id);
    }
    createSmartworkingSession(body) {
        return this.hr.createSmartworkingSession(body);
    }
};
exports.HrController = HrController;
__decorate([
    (0, common_1.Get)('employees'),
    (0, roles_decorator_1.Roles)('HR_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HrController.prototype, "listEmployees", null);
__decorate([
    (0, common_1.Get)('time-entries'),
    __param(0, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "listTimeEntries", null);
__decorate([
    (0, common_1.Get)('smartworking-sessions'),
    __param(0, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "listSmartworkingSessions", null);
__decorate([
    (0, common_1.Get)('leave-requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HrController.prototype, "listLeaveRequests", null);
__decorate([
    (0, common_1.Post)('leave-requests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Patch)('leave-requests/:id/approve'),
    (0, roles_decorator_1.Roles)('HR_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "approveLeaveRequest", null);
__decorate([
    (0, common_1.Patch)('leave-requests/:id/reject'),
    (0, roles_decorator_1.Roles)('HR_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "rejectLeaveRequest", null);
__decorate([
    (0, common_1.Post)('employees'),
    (0, roles_decorator_1.Roles)('HR_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Post)('time-entries'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_time_entry_dto_1.RecordTimeEntryDto]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "recordTimeEntry", null);
__decorate([
    (0, common_1.Patch)('time-entries/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "approveTimeEntry", null);
__decorate([
    (0, common_1.Post)('smartworking-sessions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createSmartworkingSession", null);
exports.HrController = HrController = __decorate([
    (0, common_1.Controller)('hr'),
    __metadata("design:paramtypes", [hr_service_1.HrService])
], HrController);
//# sourceMappingURL=hr.controller.js.map