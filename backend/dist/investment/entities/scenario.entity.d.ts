import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { InvestmentProposal } from './investment-proposal.entity';
export declare class InvestmentScenario extends BaseEntityWithTenant {
    proposal: InvestmentProposal;
    name: string;
    npv: string;
}
