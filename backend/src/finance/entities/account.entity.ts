import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Ledger } from './ledger.entity';

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

@Entity({ name: 'fin_accounts' })
export class Account extends BaseEntityWithTenant {
  @ManyToOne(() => Ledger, (ledger) => ledger.accounts, { nullable: false })
  ledger!: Ledger;

  @Column({ type: 'varchar', length: 32 })
  code!: string;

  @Column({ type: 'varchar', length: 256 })
  name!: string;

  @Column({ type: 'varchar', length: 16 })
  type!: AccountType;
}

