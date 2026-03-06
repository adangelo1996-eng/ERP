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
exports.SmartworkingSession = exports.SmartworkingPolicy = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const employee_entity_1 = require("./employee.entity");
let SmartworkingPolicy = class SmartworkingPolicy extends base_entity_1.BaseEntityWithTenant {
    name;
    maxDaysPerWeek;
};
exports.SmartworkingPolicy = SmartworkingPolicy;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 256 }),
    __metadata("design:type", String)
], SmartworkingPolicy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SmartworkingPolicy.prototype, "maxDaysPerWeek", void 0);
exports.SmartworkingPolicy = SmartworkingPolicy = __decorate([
    (0, typeorm_1.Entity)({ name: 'hr_smartworking_policies' })
], SmartworkingPolicy);
let SmartworkingSession = class SmartworkingSession extends base_entity_1.BaseEntityWithTenant {
    employee;
    date;
    deviceId;
};
exports.SmartworkingSession = SmartworkingSession;
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: false }),
    __metadata("design:type", employee_entity_1.Employee)
], SmartworkingSession.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], SmartworkingSession.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], SmartworkingSession.prototype, "deviceId", void 0);
exports.SmartworkingSession = SmartworkingSession = __decorate([
    (0, typeorm_1.Entity)({ name: 'hr_smartworking_sessions' })
], SmartworkingSession);
//# sourceMappingURL=smartworking.entity.js.map