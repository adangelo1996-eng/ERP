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
exports.WarehouseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("./entities/stock.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const location_entity_1 = require("./entities/location.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let WarehouseService = class WarehouseService {
    stockRepo;
    warehouseRepo;
    locationRepo;
    movementRepo;
    events;
    tenantContext;
    constructor(stockRepo, warehouseRepo, locationRepo, movementRepo, events, tenantContext) {
        this.stockRepo = stockRepo;
        this.warehouseRepo = warehouseRepo;
        this.locationRepo = locationRepo;
        this.movementRepo = movementRepo;
        this.events = events;
        this.tenantContext = tenantContext;
    }
    async listWarehouses() {
        const tenantId = this.tenantContext.getTenantId();
        return this.warehouseRepo.find({
            where: { tenantId },
            order: { code: 'ASC' },
        });
    }
    async listLocations(warehouseCode) {
        const tenantId = this.tenantContext.getTenantId();
        const where = { tenantId };
        if (warehouseCode) {
            where.warehouse = { code: warehouseCode };
        }
        return this.locationRepo.find({
            where,
            order: { code: 'ASC' },
            relations: ['warehouse'],
        });
    }
    async listStock(warehouseCode, itemId, limit = 100) {
        const tenantId = this.tenantContext.getTenantId();
        const qb = this.stockRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.location', 'loc')
            .leftJoinAndSelect('loc.warehouse', 'wh')
            .where('s.tenantId = :tenantId', { tenantId });
        if (warehouseCode) {
            qb.andWhere('wh.code = :warehouseCode', { warehouseCode });
        }
        if (itemId) {
            qb.andWhere('s.itemId = :itemId', { itemId });
        }
        qb.orderBy('s.updatedAt', 'DESC').take(limit);
        return qb.getMany();
    }
    async listStockMovements(limit = 50, type) {
        const tenantId = this.tenantContext.getTenantId();
        const where = { tenantId };
        if (type)
            where.type = type;
        return this.movementRepo.find({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            relations: ['fromLocation', 'toLocation'],
        });
    }
    async receiveGoods(input) {
        const tenantId = this.tenantContext.getTenantId();
        const warehouse = await this.warehouseRepo.findOneByOrFail({
            tenantId,
            code: input.warehouseCode,
        });
        const location = await this.locationRepo.findOneByOrFail({
            tenantId,
            warehouse: { id: warehouse.id },
            code: input.locationCode,
        });
        let stock = await this.stockRepo.findOne({
            where: {
                tenantId,
                location: { id: location.id },
                itemId: input.itemId,
                batch: input.batch,
            },
        });
        if (!stock) {
            stock = this.stockRepo.create({
                tenantId,
                location,
                itemId: input.itemId,
                batch: input.batch,
                quantity: input.quantity,
            });
        }
        else {
            stock.quantity = (Number(stock.quantity) + Number(input.quantity)).toString();
        }
        await this.stockRepo.save(stock);
        const receivingLoc = await this.locationRepo.findOne({
            where: { tenantId, warehouse: { id: warehouse.id }, code: 'RECEIVING' },
        });
        const fromLoc = receivingLoc ?? location;
        await this.movementRepo.save(this.movementRepo.create({
            tenantId,
            type: 'RECEIPT',
            fromLocation: fromLoc,
            toLocation: location,
            itemId: input.itemId,
            batch: input.batch,
            quantity: input.quantity,
        }));
        await this.events.publish({
            name: 'StockLevelChanged',
            occurredAt: new Date(),
            tenantId,
            payload: {
                itemId: input.itemId,
                warehouseId: warehouse.id,
            },
        });
        return stock;
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.StockItem)),
    __param(1, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(2, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map