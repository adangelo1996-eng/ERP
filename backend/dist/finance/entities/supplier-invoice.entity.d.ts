import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalEntry } from './journal-entry.entity';
export type SupplierInvoiceStatus = 'DRAFT' | 'REGISTERED' | 'POSTED' | 'PAID' | 'CANCELLED';
export declare class SupplierInvoice extends BaseEntityWithTenant {
    supplierId: string;
    invoiceDate: string;
    dueDate: string;
    currency: string;
    totalNet: string;
    totalTax: string;
    status: SupplierInvoiceStatus;
    purchaseOrderId?: string;
    postingEntry?: JournalEntry | null;
    lines: SupplierInvoiceLine[];
}
export declare class SupplierInvoiceLine extends BaseEntityWithTenant {
    invoice: SupplierInvoice;
    itemId: string;
    description: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
}
