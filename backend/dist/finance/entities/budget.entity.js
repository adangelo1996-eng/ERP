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
exports.Budget = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const cost_center_entity_1 = require("./cost-center.entity");
const project_entity_1 = require("./project.entity");
let Budget = class Budget extends base_entity_1.BaseEntityWithTenant {
    year;
    costCenter;
    project;
    amount;
};
exports.Budget = Budget;
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Budget.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cost_center_entity_1.CostCenter, { nullable: true }),
    __metadata("design:type", Object)
], Budget.prototype, "costCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, { nullable: true }),
    __metadata("design:type", Object)
], Budget.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], Budget.prototype, "amount", void 0);
exports.Budget = Budget = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_budgets' })
], Budget);
//# sourceMappingURL=budget.entity.js.map