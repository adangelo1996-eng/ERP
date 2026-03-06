import { BaseEntityWithTenant } from '../../core/database/base-entity';
export type PaymentDirection = 'INBOUND' | 'OUTBOUND';
export declare class Payment extends BaseEntityWithTenant {
    counterpartyId: string;
    direction: PaymentDirection;
    paymentDate: string;
    currency: string;
    amount: string;
    relatedInvoiceId?: string;
}
