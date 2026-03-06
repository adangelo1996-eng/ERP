import { FinanceService } from './finance.service';
import { PostJournalEntryDto } from './dto/post-journal-entry.dto';
export declare class FinanceController {
    private readonly finance;
    constructor(finance: FinanceService);
    listLedgers(): Promise<import("./entities/ledger.entity").Ledger[]>;
    listAccounts(): Promise<import("./entities/account.entity").Account[]>;
    listJournalEntries(): Promise<import("./entities/journal-entry.entity").JournalEntry[]>;
    listSupplierInvoices(): Promise<import("./entities/supplier-invoice.entity").SupplierInvoice[]>;
    listCustomerInvoices(): Promise<import("./entities/customer-invoice.entity").CustomerInvoice[]>;
    listPayments(): Promise<import("./entities/payment.entity").Payment[]>;
    initDemo(): Promise<{
        ledger: import("./entities/ledger.entity").Ledger;
        accounts: import("./entities/account.entity").Account[];
    }>;
    postJournalEntry(body: PostJournalEntryDto): Promise<import("./entities/journal-entry.entity").JournalEntry>;
    registerCustomerInvoice(body: any): Promise<{
        tenantId: string;
        customerId?: string | undefined;
        invoiceDate?: string | undefined;
        dueDate?: string | undefined;
        currency?: string | undefined;
        totalNet?: string | undefined;
        totalTax?: string | undefined;
        status?: import("./entities/customer-invoice.entity").InvoiceStatus | undefined;
        salesOrderId?: string | undefined;
        postingEntry?: (import("./entities/journal-entry.entity").JournalEntry | null) | undefined;
        lines?: import("./entities/customer-invoice.entity").CustomerInvoiceLine[] | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & import("./entities/customer-invoice.entity").CustomerInvoice>;
    registerSupplierInvoice(body: any): Promise<{
        tenantId: string;
        supplierId?: string | undefined;
        invoiceDate?: string | undefined;
        dueDate?: string | undefined;
        currency?: string | undefined;
        totalNet?: string | undefined;
        totalTax?: string | undefined;
        status?: import("./entities/supplier-invoice.entity").SupplierInvoiceStatus | undefined;
        purchaseOrderId?: string | undefined;
        postingEntry?: (import("./entities/journal-entry.entity").JournalEntry | null) | undefined;
        lines?: import("./entities/supplier-invoice.entity").SupplierInvoiceLine[] | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & import("./entities/supplier-invoice.entity").SupplierInvoice>;
    recordPayment(body: any): Promise<{
        tenantId: string;
        counterpartyId?: string | undefined;
        direction?: import("./entities/payment.entity").PaymentDirection | undefined;
        paymentDate?: string | undefined;
        currency?: string | undefined;
        amount?: string | undefined;
        relatedInvoiceId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & import("./entities/payment.entity").Payment>;
}
