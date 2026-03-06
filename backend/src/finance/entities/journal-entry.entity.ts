import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalLine } from './journal-line.entity';
import { Ledger } from './ledger.entity';

export type JournalSource =
  | 'MANUAL'
  | 'SALES'
  | 'PURCHASES'
  | 'PAYROLL'
  | 'INVENTORY'
  | 'INVESTMENT';

@Entity({ name: 'fin_journal_entries' })
export class JournalEntry extends BaseEntityWithTenant {
  @ManyToOne(() => Ledger, { nullable: false })
  @JoinColumn()
  ledger!: Ledger;

  @Column({ type: 'date' })
  postingDate!: string;

  @Column({ type: 'varchar', length: 128 })
  reference!: string;

  @Column({ type: 'varchar', length: 32 })
  source!: JournalSource;

  @Column({ type: 'boolean', default: false })
  posted!: boolean;

  @OneToMany(() => JournalLine, (line) => line.entry, {
    cascade: true,
  })
  lines!: JournalLine[];
}

