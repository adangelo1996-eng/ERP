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
exports.ApprovalStep = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../database/base-entity");
let ApprovalStep = class ApprovalStep extends base_entity_1.BaseEntityWithTenant {
    contextType;
    contextId;
    stepOrder;
    status;
    approvedBy;
    approvedAt;
};
exports.ApprovalStep = ApprovalStep;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], ApprovalStep.prototype, "contextType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], ApprovalStep.prototype, "contextId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ApprovalStep.prototype, "stepOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16 }),
    __metadata("design:type", String)
], ApprovalStep.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], ApprovalStep.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ApprovalStep.prototype, "approvedAt", void 0);
exports.ApprovalStep = ApprovalStep = __decorate([
    (0, typeorm_1.Entity)({ name: 'core_approval_steps' })
], ApprovalStep);
//# sourceMappingURL=approval-step.entity.js.map