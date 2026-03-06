import { InvestmentService } from './investment.service';
export declare class InvestmentController {
    private readonly investment;
    constructor(investment: InvestmentService);
    listProposals(): Promise<import("./entities/investment-proposal.entity").InvestmentProposal[]>;
    listScenarios(proposalId: string): Promise<import("./entities/scenario.entity").InvestmentScenario[]>;
    createProposal(body: {
        title: string;
        sponsorArea: string;
    }): Promise<{
        tenantId: string;
        title: string;
        sponsorArea: string;
    } & import("./entities/investment-proposal.entity").InvestmentProposal>;
    addScenario(body: {
        proposalId: string;
        name: string;
        cashFlows: number[];
        discountRate: number;
    }): Promise<{
        tenantId: string;
        proposal: import("./entities/investment-proposal.entity").InvestmentProposal;
        name: string;
        npv: string;
    } & import("./entities/scenario.entity").InvestmentScenario>;
}
