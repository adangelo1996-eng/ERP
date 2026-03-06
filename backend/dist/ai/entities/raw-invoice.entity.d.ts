import { BaseEntityWithTenant } from '../../core/database/base-entity';
export type RawInvoiceStatus = 'IMPORTED' | 'PROCESSED' | 'FAILED';
export declare class RawInvoice extends BaseEntityWithTenant {
    externalId: string;
    payload: unknown;
    status: RawInvoiceStatus;
}
