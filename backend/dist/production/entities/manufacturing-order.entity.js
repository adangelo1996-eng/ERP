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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOOperation = exports.ManufacturingOrder = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const production_item_entity_1 = require("./production-item.entity");
const routing_entity_1 = require("./routing.entity");
let ManufacturingOrder = class ManufacturingOrder extends base_entity_1.BaseEntityWithTenant {
    item;
    quantity;
    dueDate;
    status;
    operations;
};
exports.ManufacturingOrder = ManufacturingOrder;
__decorate([
    (0, typeorm_1.ManyToOne)(() => production_item_entity_1.ProductionItem, { nullable: false }),
    __metadata("design:type", production_item_entity_1.ProductionItem)
], ManufacturingOrder.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], ManufacturingOrder.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], ManufacturingOrder.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], ManufacturingOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MOOperation, (op) => op.mo, { cascade: true }),
    __metadata("design:type", Array)
], ManufacturingOrder.prototype, "operations", void 0);
exports.ManufacturingOrder = ManufacturingOrder = __decorate([
    (0, typeorm_1.Entity)({ name: 'prod_mos' })
], ManufacturingOrder);
let MOOperation = class MOOperation extends base_entity_1.BaseEntityWithTenant {
    mo;
    operation;
    status;
    quantityCompleted;
};
exports.MOOperation = MOOperation;
__decorate([
    (0, typeorm_1.ManyToOne)(() => ManufacturingOrder, (mo) => mo.operations, {
        nullable: false,
    }),
    __metadata("design:type", ManufacturingOrder)
], MOOperation.prototype, "mo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => routing_entity_1.Operation, { nullable: false }),
    __metadata("design:type", routing_entity_1.Operation)
], MOOperation.prototype, "operation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], MOOperation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", String)
], MOOperation.prototype, "quantityCompleted", void 0);
exports.MOOperation = MOOperation = __decorate([
    (0, typeorm_1.Entity)({ name: 'prod_mo_operations' })
], MOOperation);
//# sourceMappingURL=manufacturing-order.entity.js.map