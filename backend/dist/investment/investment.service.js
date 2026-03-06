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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investment_proposal_entity_1 = require("./entities/investment-proposal.entity");
const scenario_entity_1 = require("./entities/scenario.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let InvestmentService = class InvestmentService {
    proposalRepo;
    scenarioRepo;
    events;
    tenantContext;
    constructor(proposalRepo, scenarioRepo, events, tenantContext) {
        this.proposalRepo = proposalRepo;
        this.scenarioRepo = scenarioRepo;
        this.events = events;
        this.tenantContext = tenantContext;
    }
    async listProposals(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.proposalRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async listScenarios(proposalId) {
        const tenantId = this.tenantContext.getTenantId();
        return this.scenarioRepo.find({
            where: { tenantId, proposal: { id: proposalId } },
            order: { createdAt: 'DESC' },
            relations: ['proposal'],
        });
    }
    async createProposal(input) {
        const tenantId = this.tenantContext.getTenantId();
        const proposal = await this.proposalRepo.save({
            tenantId,
            title: input.title,
            sponsorArea: input.sponsorArea,
        });
        await this.events.publish({
            name: 'InvestmentProposalCreated',
            occurredAt: new Date(),
            tenantId,
            payload: { proposalId: proposal.id },
        });
        return proposal;
    }
    async addScenario(input) {
        const tenantId = this.tenantContext.getTenantId();
        const proposal = await this.proposalRepo.findOneByOrFail({
            id: input.proposalId,
            tenantId,
        });
        const npv = this.calculateNpv(input.cashFlows, input.discountRate);
        const scenario = await this.scenarioRepo.save({
            tenantId,
            proposal,
            name: input.name,
            npv: npv.toFixed(2),
        });
        await this.events.publish({
            name: 'InvestmentScenarioCreated',
            occurredAt: new Date(),
            tenantId,
            payload: { scenarioId: scenario.id },
        });
        return scenario;
    }
    calculateNpv(cashFlows, discountRate) {
        return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + discountRate, t + 1), 0);
    }
};
exports.InvestmentService = InvestmentService;
exports.InvestmentService = InvestmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investment_proposal_entity_1.InvestmentProposal)),
    __param(1, (0, typeorm_1.InjectRepository)(scenario_entity_1.InvestmentScenario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService])
], InvestmentService);
//# sourceMappingURL=investment.service.js.map