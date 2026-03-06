import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ledger } from './entities/ledger.entity';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { CustomerInvoice } from './entities/customer-invoice.entity';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { Payment } from './entities/payment.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
interface PostJournalEntryDto {
    ledgerId: string;
    postingDate: string;
    reference: string;
    source: string;
    lines: {
        accountId: string;
        debit: string;
        credit: string;
        description?: string;
    }[];
}
export declare class FinanceService implements OnModuleInit {
    private readonly ledgerRepo;
    private readonly accountRepo;
    private readonly journalRepo;
    private readonly lineRepo;
    private readonly customerInvoiceRepo;
    private readonly supplierInvoiceRepo;
    private readonly paymentRepo;
    private readonly events;
    private readonly tenantContext;
    constructor(ledgerRepo: Repository<Ledger>, accountRepo: Repository<Account>, journalRepo: Repository<JournalEntry>, lineRepo: Repository<JournalLine>, customerInvoiceRepo: Repository<CustomerInvoice>, supplierInvoiceRepo: Repository<SupplierInvoice>, paymentRepo: Repository<Payment>, events: EventBusService, tenantContext: TenantContextService);
    onModuleInit(): void;
    listLedgers(): Promise<Ledger[]>;
    listAccounts(): Promise<Account[]>;
    listJournalEntries(limit?: number): Promise<JournalEntry[]>;
    listSupplierInvoices(limit?: number): Promise<SupplierInvoice[]>;
    listCustomerInvoices(limit?: number): Promise<CustomerInvoice[]>;
    listPayments(limit?: number): Promise<Payment[]>;
    initDemoData(): Promise<{
        ledger: Ledger;
        accounts: Account[];
    }>;
    postJournalEntry(dto: PostJournalEntryDto): Promise<JournalEntry>;
    registerCustomerInvoice(invoice: Partial<CustomerInvoice>): Promise<{
        tenantId: string;
        customerId?: string | undefined;
        invoiceDate?: string | undefined;
        dueDate?: string | undefined;
        currency?: string | undefined;
        totalNet?: string | undefined;
        totalTax?: string | undefined;
        status?: import("./entities/customer-invoice.entity").InvoiceStatus | undefined;
        salesOrderId?: string | undefined;
        postingEntry?: (JournalEntry | null) | undefined;
        lines?: import("./entities/customer-invoice.entity").CustomerInvoiceLine[] | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & CustomerInvoice>;
    registerSupplierInvoice(invoice: Partial<SupplierInvoice>): Promise<{
        tenantId: string;
        supplierId?: string | undefined;
        invoiceDate?: string | undefined;
        dueDate?: string | undefined;
        currency?: string | undefined;
        totalNet?: string | undefined;
        totalTax?: string | undefined;
        status?: import("./entities/supplier-invoice.entity").SupplierInvoiceStatus | undefined;
        purchaseOrderId?: string | undefined;
        postingEntry?: (JournalEntry | null) | undefined;
        lines?: import("./entities/supplier-invoice.entity").SupplierInvoiceLine[] | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & SupplierInvoice>;
    recordPayment(payment: Partial<Payment>): Promise<{
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
    } & Payment>;
}
export {};
