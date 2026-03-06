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
exports.ProductionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manufacturing_order_entity_1 = require("./entities/manufacturing-order.entity");
const production_item_entity_1 = require("./entities/production-item.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let ProductionService = class ProductionService {
    moRepo;
    itemRepo;
    events;
    tenantContext;
    constructor(moRepo, itemRepo, events, tenantContext) {
        this.moRepo = moRepo;
        this.itemRepo = itemRepo;
        this.events = events;
        this.tenantContext = tenantContext;
    }
    async listProductionItems(limit = 200) {
        const tenantId = this.tenantContext.getTenantId();
        return this.itemRepo.find({
            where: { tenantId },
            order: { itemId: 'ASC' },
            take: limit,
        });
    }
    async getManufacturingOrder(id) {
        const tenantId = this.tenantContext.getTenantId();
        return this.moRepo.findOneOrFail({
            where: { id, tenantId },
            relations: ['item'],
        });
    }
    async listManufacturingOrders(limit = 50, status) {
        const tenantId = this.tenantContext.getTenantId();
        const where = { tenantId };
        if (status)
            where.status = status;
        return this.moRepo.find({
            where,
            order: { dueDate: 'ASC', createdAt: 'DESC' },
            take: limit,
            relations: ['item'],
        });
    }
    async createManufacturingOrder(input) {
        const tenantId = this.tenantContext.getTenantId();
        const item = await this.itemRepo.findOneByOrFail({
            tenantId,
            itemId: input.itemId,
        });
        const mo = this.moRepo.create({
            tenantId,
            item,
            quantity: input.quantity,
            dueDate: input.dueDate,
            status: 'PLANNED',
            operations: [],
        });
        const saved = await this.moRepo.save(mo);
        await this.events.publish({
            name: 'ManufacturingOrderPlanned',
            occurredAt: new Date(),
            tenantId,
            payload: { moId: saved.id },
        });
        return saved;
    }
    async releaseManufacturingOrder(moId) {
        const tenantId = this.tenantContext.getTenantId();
        const mo = await this.moRepo.findOneByOrFail({ id: moId, tenantId });
        mo.status = 'RELEASED';
        const saved = await this.moRepo.save(mo);
        await this.events.publish({
            name: 'ManufacturingOrderReleased',
            occurredAt: new Date(),
            tenantId,
            payload: { moId: saved.id },
        });
        return saved;
    }
    async completeManufacturingOrder(moId) {
        const tenantId = this.tenantContext.getTenantId();
        const mo = await this.moRepo.findOneByOrFail({ id: moId, tenantId });
        mo.status = 'COMPLETED';
        const saved = await this.moRepo.save(mo);
        await this.events.publish({
            name: 'MOCompleted',
            occurredAt: new Date(),
            tenantId,
            payload: { moId: saved.id },
        });
        return saved;
    }
};
exports.ProductionService = ProductionService;
exports.ProductionService = ProductionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manufacturing_order_entity_1.ManufacturingOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(production_item_entity_1.ProductionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService])
], ProductionService);
//# sourceMappingURL=production.service.js.map