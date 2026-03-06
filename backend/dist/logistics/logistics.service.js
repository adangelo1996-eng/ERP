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
exports.LogisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipment_entity_1 = require("./entities/shipment.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let LogisticsService = class LogisticsService {
    shipmentRepo;
    events;
    tenantContext;
    constructor(shipmentRepo, events, tenantContext) {
        this.shipmentRepo = shipmentRepo;
        this.events = events;
        this.tenantContext = tenantContext;
    }
    async listShipments(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.shipmentRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async createShipment(input) {
        const tenantId = this.tenantContext.getTenantId();
        const shipment = this.shipmentRepo.create({
            tenantId,
            orderId: input.orderId,
            status: 'PLANNED',
        });
        const saved = await this.shipmentRepo.save(shipment);
        await this.events.publish({
            name: 'ShipmentCreated',
            occurredAt: new Date(),
            tenantId,
            payload: { shipmentId: saved.id },
        });
        return saved;
    }
};
exports.LogisticsService = LogisticsService;
exports.LogisticsService = LogisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shipment_entity_1.Shipment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService])
], LogisticsService);
//# sourceMappingURL=logistics.service.js.map