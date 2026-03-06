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
exports.ApprovalsController = void 0;
const common_1 = require("@nestjs/common");
const approval_workflow_service_1 = require("./approval-workflow.service");
const roles_decorator_1 = require("../core/auth/roles.decorator");
let ApprovalsController = class ApprovalsController {
    approvalService;
    constructor(approvalService) {
        this.approvalService = approvalService;
    }
    listPending() {
        return this.approvalService.listPending();
    }
    approve(body) {
        return this.approvalService.approve(body.contextType, body.contextId, body.approvedBy);
    }
};
exports.ApprovalsController = ApprovalsController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER', 'PROCUREMENT_MANAGER', 'HR_MANAGER', 'INVESTMENT_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApprovalsController.prototype, "listPending", null);
__decorate([
    (0, common_1.Patch)('approve'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER', 'PROCUREMENT_MANAGER', 'HR_MANAGER', 'INVESTMENT_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApprovalsController.prototype, "approve", null);
exports.ApprovalsController = ApprovalsController = __decorate([
    (0, common_1.Controller)('approvals'),
    __metadata("design:paramtypes", [approval_workflow_service_1.ApprovalWorkflowService])
], ApprovalsController);
//# sourceMappingURL=approvals.controller.js.map