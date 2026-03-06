import { Repository } from 'typeorm';
import { InvestmentProposal } from './entities/investment-proposal.entity';
import { InvestmentScenario } from './entities/scenario.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
export declare class InvestmentService {
    private readonly proposalRepo;
    private readonly scenarioRepo;
    private readonly events;
    private readonly tenantContext;
    constructor(proposalRepo: Repository<InvestmentProposal>, scenarioRepo: Repository<InvestmentScenario>, events: EventBusService, tenantContext: TenantContextService);
    listProposals(limit?: number): Promise<InvestmentProposal[]>;
    listScenarios(proposalId: string): Promise<InvestmentScenario[]>;
    createProposal(input: {
        title: string;
        sponsorArea: string;
    }): Promise<{
        tenantId: string;
        title: string;
        sponsorArea: string;
    } & InvestmentProposal>;
    addScenario(input: {
        proposalId: string;
        name: string;
        cashFlows: number[];
        discountRate: number;
    }): Promise<{
        tenantId: string;
        proposal: InvestmentProposal;
        name: string;
        npv: string;
    } & InvestmentScenario>;
    private calculateNpv;
}
