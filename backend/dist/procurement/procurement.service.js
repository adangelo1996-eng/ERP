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
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_request_entity_1 = require("./entities/purchase-request.entity");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
const approval_workflow_service_1 = require("../approvals/approval-workflow.service");
let ProcurementService = class ProcurementService {
    prRepo;
    poRepo;
    lineRepo;
    supplierRepo;
    events;
    tenantContext;
    approvalWorkflow;
    constructor(prRepo, poRepo, lineRepo, supplierRepo, events, tenantContext, approvalWorkflow) {
        this.prRepo = prRepo;
        this.poRepo = poRepo;
        this.lineRepo = lineRepo;
        this.supplierRepo = supplierRepo;
        this.events = events;
        this.tenantContext = tenantContext;
        this.approvalWorkflow = approvalWorkflow;
    }
    async listPurchaseRequests(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.prRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async listPurchaseOrders(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.poRepo.find({
            where: { tenantId },
            order: { orderDate: 'DESC', createdAt: 'DESC' },
            take: limit,
            relations: ['supplier', 'lines'],
        });
    }
    async listSuppliers(limit = 100) {
        const tenantId = this.tenantContext.getTenantId();
        return this.supplierRepo.find({
            where: { tenantId },
            order: { name: 'ASC' },
            take: limit,
        });
    }
    async createPurchaseRequest(input) {
        const tenantId = this.tenantContext.getTenantId();
        const pr = this.prRepo.create({
            tenantId,
            requesterId: input.requesterId,
            itemId: input.itemId,
            quantity: input.quantity,
            estimatedValue: input.estimatedValue,
            status: 'SUBMITTED',
        });
        const saved = await this.prRepo.save(pr);
        const amount = input.estimatedValue ? Number(input.estimatedValue) : 0;
        const w = await this.approvalWorkflow.getWorkflowFor('PR', amount);
        if (w && amount >= Number(w.thresholdAmount || 0)) {
            await this.approvalWorkflow.createPendingStep('PR', saved.id);
        }
        await this.events.publish({
            name: 'PurchaseRequestSubmitted',
            occurredAt: new Date(),
            tenantId,
            payload: { purchaseRequestId: saved.id },
        });
        return saved;
    }
    async approvePurchaseRequest(id, approvedBy) {
        const tenantId = this.tenantContext.getTenantId();
        const pr = await this.prRepo.findOneByOrFail({ id, tenantId });
        pr.status = 'APPROVED';
        const saved = await this.prRepo.save(pr);
        try {
            await this.approvalWorkflow.approve('PR', id, approvedBy || 'system');
        }
        catch {
        }
        await this.events.publish({
            name: 'PurchaseRequestApproved',
            occurredAt: new Date(),
            tenantId,
            payload: { purchaseRequestId: saved.id },
        });
        return saved;
    }
    async createPurchaseOrder(input) {
        const tenantId = this.tenantContext.getTenantId();
        const supplier = await this.supplierRepo.findOneByOrFail({
            id: input.supplierId,
            tenantId,
        });
        const po = this.poRepo.create({
            tenantId,
            supplier,
            orderDate: new Date().toISOString().slice(0, 10),
            status: 'OPEN',
            lines: input.lines.map((l) => this.lineRepo.create({
                tenantId,
                itemId: l.itemId,
                quantity: l.quantity,
                quantityReceived: '0',
                unitPrice: l.unitPrice,
            })),
        });
        const saved = await this.poRepo.save(po);
        await this.events.publish({
            name: 'PurchaseOrderCreated',
            occurredAt: new Date(),
            tenantId,
            payload: { purchaseOrderId: saved.id },
        });
        return saved;
    }
};
exports.ProcurementService = ProcurementService;
exports.ProcurementService = ProcurementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_request_entity_1.PurchaseRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(2, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrderLine)),
    __param(3, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService,
        approval_workflow_service_1.ApprovalWorkflowService])
], ProcurementService);
//# sourceMappingURL=procurement.service.js.map