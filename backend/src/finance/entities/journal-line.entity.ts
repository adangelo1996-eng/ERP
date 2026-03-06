import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalEntry } from './journal-entry.entity';
import { Account } from './account.entity';

@Entity({ name: 'fin_journal_lines' })
export class JournalLine extends BaseEntityWithTenant {
  @ManyToOne(() => JournalEntry, (entry) => entry.lines, { nullable: false })
  entry!: JournalEntry;

  @ManyToOne(() => Account, { nullable: false })
  account!: Account;

  @Column({ type: 'numeric', precision: 18, scale: 4, default: 0 })
  debit!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4, default: 0 })
  credit!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  description?: string;
}

