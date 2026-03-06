import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'inv_investment_proposals' })
export class InvestmentProposal extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 256 })
  title!: string;

  @Column({ type: 'varchar', length: 64 })
  sponsorArea!: string;
}

