import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Account } from './account.entity';
export declare class Ledger extends BaseEntityWithTenant {
    name: string;
    currency: string;
    accounts: Account[];
}
