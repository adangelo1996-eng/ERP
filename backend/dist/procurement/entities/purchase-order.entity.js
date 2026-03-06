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
exports.PurchaseOrderLine = exports.PurchaseOrder = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const supplier_entity_1 = require("./supplier.entity");
let PurchaseOrder = class PurchaseOrder extends base_entity_1.BaseEntityWithTenant {
    supplier;
    orderDate;
    status;
    lines;
};
exports.PurchaseOrder = PurchaseOrder;
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, { nullable: false }),
    __metadata("design:type", supplier_entity_1.Supplier)
], PurchaseOrder.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseOrderLine, (l) => l.order, { cascade: true }),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "lines", void 0);
exports.PurchaseOrder = PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)({ name: 'proc_purchase_orders' })
], PurchaseOrder);
let PurchaseOrderLine = class PurchaseOrderLine extends base_entity_1.BaseEntityWithTenant {
    order;
    itemId;
    quantity;
    quantityReceived;
    unitPrice;
};
exports.PurchaseOrderLine = PurchaseOrderLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseOrder, (o) => o.lines, { nullable: false }),
    __metadata("design:type", PurchaseOrder)
], PurchaseOrderLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], PurchaseOrderLine.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], PurchaseOrderLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], PurchaseOrderLine.prototype, "quantityReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], PurchaseOrderLine.prototype, "unitPrice", void 0);
exports.PurchaseOrderLine = PurchaseOrderLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'proc_purchase_order_lines' })
], PurchaseOrderLine);
//# sourceMappingURL=purchase-order.entity.js.map