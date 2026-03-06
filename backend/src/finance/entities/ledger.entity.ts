import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Account } from './account.entity';

@Entity({ name: 'fin_ledgers' })
export class Ledger extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 16 })
  currency!: string;

  @OneToMany(() => Account, (account) => account.ledger)
  accounts!: Account[];
}

