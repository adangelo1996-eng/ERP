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
exports.LegalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("./entities/contract.entity");
const legal_case_entity_1 = require("./entities/legal-case.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let LegalService = class LegalService {
    contractRepo;
    caseRepo;
    events;
    tenantContext;
    constructor(contractRepo, caseRepo, events, tenantContext) {
        this.contractRepo = contractRepo;
        this.caseRepo = caseRepo;
        this.events = events;
        this.tenantContext = tenantContext;
    }
    async listContracts(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.contractRepo.find({
            where: { tenantId },
            order: { startDate: 'DESC', createdAt: 'DESC' },
            take: limit,
        });
    }
    async listCases(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.caseRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async createContract(input) {
        const tenantId = this.tenantContext.getTenantId();
        const contract = await this.contractRepo.save({
            ...input,
            tenantId,
        });
        await this.events.publish({
            name: 'ContractSigned',
            occurredAt: new Date(),
            tenantId,
            payload: { contractId: contract.id },
        });
        return contract;
    }
    async createLegalCase(input) {
        const tenantId = this.tenantContext.getTenantId();
        return this.caseRepo.save({
            tenantId,
            title: input.title,
            status: 'OPEN',
        });
    }
};
exports.LegalService = LegalService;
exports.LegalService = LegalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __param(1, (0, typeorm_1.InjectRepository)(legal_case_entity_1.LegalCase)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService])
], LegalService);
//# sourceMappingURL=legal.service.js.map