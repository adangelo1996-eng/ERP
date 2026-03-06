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
exports.StockMovement = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const location_entity_1 = require("./location.entity");
let StockMovement = class StockMovement extends base_entity_1.BaseEntityWithTenant {
    type;
    fromLocation;
    toLocation;
    itemId;
    batch;
    quantity;
};
exports.StockMovement = StockMovement;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16 }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, { nullable: false }),
    __metadata("design:type", location_entity_1.Location)
], StockMovement.prototype, "fromLocation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, { nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "toLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], StockMovement.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], StockMovement.prototype, "quantity", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)({ name: 'wh_stock_movements' })
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map