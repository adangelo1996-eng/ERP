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
exports.PerformanceReview = exports.PerformanceGoal = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const employee_entity_1 = require("./employee.entity");
let PerformanceGoal = class PerformanceGoal extends base_entity_1.BaseEntityWithTenant {
    employee;
    description;
};
exports.PerformanceGoal = PerformanceGoal;
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: false }),
    __metadata("design:type", employee_entity_1.Employee)
], PerformanceGoal.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 256 }),
    __metadata("design:type", String)
], PerformanceGoal.prototype, "description", void 0);
exports.PerformanceGoal = PerformanceGoal = __decorate([
    (0, typeorm_1.Entity)({ name: 'hr_performance_goals' })
], PerformanceGoal);
let PerformanceReview = class PerformanceReview extends base_entity_1.BaseEntityWithTenant {
    employee;
    reviewDate;
    score;
};
exports.PerformanceReview = PerformanceReview;
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: false }),
    __metadata("design:type", employee_entity_1.Employee)
], PerformanceReview.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "reviewDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PerformanceReview.prototype, "score", void 0);
exports.PerformanceReview = PerformanceReview = __decorate([
    (0, typeorm_1.Entity)({ name: 'hr_performance_reviews' })
], PerformanceReview);
//# sourceMappingURL=performance.entity.js.map