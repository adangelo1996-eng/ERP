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
exports.BOMComponent = exports.BillOfMaterial = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const production_item_entity_1 = require("./production-item.entity");
let BillOfMaterial = class BillOfMaterial extends base_entity_1.BaseEntityWithTenant {
    parentItem;
    version;
    isActive;
    components;
};
exports.BillOfMaterial = BillOfMaterial;
__decorate([
    (0, typeorm_1.ManyToOne)(() => production_item_entity_1.ProductionItem, { nullable: false }),
    __metadata("design:type", production_item_entity_1.ProductionItem)
], BillOfMaterial.prototype, "parentItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], BillOfMaterial.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BillOfMaterial.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BOMComponent, (c) => c.bom, { cascade: true }),
    __metadata("design:type", Array)
], BillOfMaterial.prototype, "components", void 0);
exports.BillOfMaterial = BillOfMaterial = __decorate([
    (0, typeorm_1.Entity)({ name: 'prod_boms' })
], BillOfMaterial);
let BOMComponent = class BOMComponent extends base_entity_1.BaseEntityWithTenant {
    bom;
    componentItemId;
    quantity;
};
exports.BOMComponent = BOMComponent;
__decorate([
    (0, typeorm_1.ManyToOne)(() => BillOfMaterial, (b) => b.components, { nullable: false }),
    __metadata("design:type", BillOfMaterial)
], BOMComponent.prototype, "bom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], BOMComponent.prototype, "componentItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], BOMComponent.prototype, "quantity", void 0);
exports.BOMComponent = BOMComponent = __decorate([
    (0, typeorm_1.Entity)({ name: 'prod_bom_components' })
], BOMComponent);
//# sourceMappingURL=bom.entity.js.map