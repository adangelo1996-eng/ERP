import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalEntry } from './journal-entry.entity';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'POSTED' | 'PAID' | 'CANCELLED';
export declare class CustomerInvoice extends BaseEntityWithTenant {
    customerId: string;
    invoiceDate: string;
    dueDate: string;
    currency: string;
    totalNet: string;
    totalTax: string;
    status: InvoiceStatus;
    salesOrderId?: string;
    postingEntry?: JournalEntry | null;
    lines: CustomerInvoiceLine[];
}
export declare class CustomerInvoiceLine extends BaseEntityWithTenant {
    invoice: CustomerInvoice;
    itemId: string;
    description: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
}
