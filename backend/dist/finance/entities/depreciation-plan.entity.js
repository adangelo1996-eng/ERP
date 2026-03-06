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
exports.DepreciationPlan = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const fixed_asset_entity_1 = require("./fixed-asset.entity");
let DepreciationPlan = class DepreciationPlan extends base_entity_1.BaseEntityWithTenant {
    asset;
    startDate;
    endDate;
    totalAmount;
};
exports.DepreciationPlan = DepreciationPlan;
__decorate([
    (0, typeorm_1.ManyToOne)(() => fixed_asset_entity_1.FixedAsset, { nullable: false }),
    __metadata("design:type", fixed_asset_entity_1.FixedAsset)
], DepreciationPlan.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DepreciationPlan.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DepreciationPlan.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], DepreciationPlan.prototype, "totalAmount", void 0);
exports.DepreciationPlan = DepreciationPlan = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_depreciation_plans' })
], DepreciationPlan);
//# sourceMappingURL=depreciation-plan.entity.js.map