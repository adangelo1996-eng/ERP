import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalLine } from './journal-line.entity';
import { Ledger } from './ledger.entity';
export type JournalSource = 'MANUAL' | 'SALES' | 'PURCHASES' | 'PAYROLL' | 'INVENTORY' | 'INVESTMENT';
export declare class JournalEntry extends BaseEntityWithTenant {
    ledger: Ledger;
    postingDate: string;
    reference: string;
    source: JournalSource;
    posted: boolean;
    lines: JournalLine[];
}
