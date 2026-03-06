import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Ledger } from './ledger.entity';
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export declare class Account extends BaseEntityWithTenant {
    ledger: Ledger;
    code: string;
    name: string;
    type: AccountType;
}
