import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { InvestmentProposal } from './investment-proposal.entity';

@Entity({ name: 'inv_scenarios' })
export class InvestmentScenario extends BaseEntityWithTenant {
  @ManyToOne(() => InvestmentProposal, { nullable: false })
  proposal!: InvestmentProposal;

  @Column({ type: 'varchar', length: 32 })
  name!: string; // base, best, worst

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  npv!: string;
}

