import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalEntry } from './journal-entry.entity';
import { Account } from './account.entity';
export declare class JournalLine extends BaseEntityWithTenant {
    entry: JournalEntry;
    account: Account;
    debit: string;
    credit: string;
    description?: string;
}
