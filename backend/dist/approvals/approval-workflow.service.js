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
exports.ApprovalWorkflowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const approval_workflow_entity_1 = require("../core/entities/approval-workflow.entity");
const approval_step_entity_1 = require("../core/entities/approval-step.entity");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let ApprovalWorkflowService = class ApprovalWorkflowService {
    workflowRepo;
    stepRepo;
    tenantContext;
    constructor(workflowRepo, stepRepo, tenantContext) {
        this.workflowRepo = workflowRepo;
        this.stepRepo = stepRepo;
        this.tenantContext = tenantContext;
    }
    async getWorkflowFor(type, amount) {
        const tenantId = this.tenantContext.getTenantId();
        const workflows = await this.workflowRepo.find({
            where: { tenantId, type: type },
            order: { thresholdAmount: 'ASC' },
        });
        if (workflows.length === 0)
            return null;
        const amt = amount ?? 0;
        for (const w of workflows) {
            const th = Number(w.thresholdAmount ?? 0);
            if (amt >= th)
                return w;
        }
        return null;
    }
    async requiresApproval(type, contextId, amount) {
        const w = await this.getWorkflowFor(type, amount);
        if (!w)
            return false;
        const step = await this.stepRepo.findOne({
            where: { tenantId: this.tenantContext.getTenantId(), contextType: type, contextId },
        });
        return !step || step.status === 'PENDING';
    }
    async createPendingStep(type, contextId) {
        const tenantId = this.tenantContext.getTenantId();
        return this.stepRepo.save(this.stepRepo.create({
            tenantId,
            contextType: type,
            contextId,
            stepOrder: 1,
            status: 'PENDING',
        }));
    }
    async approve(contextType, contextId, approvedBy) {
        const tenantId = this.tenantContext.getTenantId();
        const step = await this.stepRepo.findOneOrFail({
            where: { tenantId, contextType, contextId },
        });
        step.status = 'APPROVED';
        step.approvedBy = approvedBy;
        step.approvedAt = new Date();
        return this.stepRepo.save(step);
    }
    async listPending(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.stepRepo.find({
            where: { tenantId, status: 'PENDING' },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
};
exports.ApprovalWorkflowService = ApprovalWorkflowService;
exports.ApprovalWorkflowService = ApprovalWorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(approval_workflow_entity_1.ApprovalWorkflow)),
    __param(1, (0, typeorm_1.InjectRepository)(approval_step_entity_1.ApprovalStep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        tenant_context_service_1.TenantContextService])
], ApprovalWorkflowService);
//# sourceMappingURL=approval-workflow.service.js.map