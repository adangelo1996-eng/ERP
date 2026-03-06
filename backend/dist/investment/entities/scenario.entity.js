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
exports.InvestmentScenario = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const investment_proposal_entity_1 = require("./investment-proposal.entity");
let InvestmentScenario = class InvestmentScenario extends base_entity_1.BaseEntityWithTenant {
    proposal;
    name;
    npv;
};
exports.InvestmentScenario = InvestmentScenario;
__decorate([
    (0, typeorm_1.ManyToOne)(() => investment_proposal_entity_1.InvestmentProposal, { nullable: false }),
    __metadata("design:type", investment_proposal_entity_1.InvestmentProposal)
], InvestmentScenario.prototype, "proposal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], InvestmentScenario.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], InvestmentScenario.prototype, "npv", void 0);
exports.InvestmentScenario = InvestmentScenario = __decorate([
    (0, typeorm_1.Entity)({ name: 'inv_scenarios' })
], InvestmentScenario);
//# sourceMappingURL=scenario.entity.js.map