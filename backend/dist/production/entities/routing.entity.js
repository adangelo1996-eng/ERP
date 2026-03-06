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
exports.Operation = exports.Routing = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const production_item_entity_1 = require("./production-item.entity");
const work_center_entity_1 = require("./work-center.entity");
let Routing = class Routing extends base_entity_1.BaseEntityWithTenant {
    item;
    version;
    isActive;
    operations;
};
exports.Routing = Routing;
__decorate([
    (0, typeorm_1.ManyToOne)(() => production_item_entity_1.ProductionItem, { nullable: false }),
    __metadata("design:type", production_item_entity_1.ProductionItem)
], Routing.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], Routing.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Routing.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Operation, (op) => op.routing, { cascade: true }),
    __metadata("design:type", Array)
], Routing.prototype, "operations", void 0);
exports.Routing = Routing = __decorate([
    (0, typeorm_1.Entity)({ name: 'prod_routings' })
], Routing);
let Operation = class Operation extends base_entity_1.BaseEntityWithTenant {
    routing;
    workCenter;
    sequence;
    setupTime;
    runTimePerUnit;
};
exports.Operation = Operation;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Routing, (r) => r.operations, { nullable: false }),
    __metadata("design:type", Routing)
], Operation.prototype, "routing", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_center_entity_1.WorkCenter, { nullable: false }),
    __metadata("design:type", work_center_entity_1.WorkCenter)
], Operation.prototype, "workCenter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Operation.prototype, "sequence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", String)
], Operation.prototype, "setupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", String)
], Operation.prototype, "runTimePerUnit", void 0);
exports.Operation = Operation = __decorate([
    (0, typeorm_1.Entity)({ name: 'prod_operations' })
], Operation);
//# sourceMappingURL=routing.entity.js.map