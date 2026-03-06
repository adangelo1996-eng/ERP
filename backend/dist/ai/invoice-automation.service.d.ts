import { Repository } from 'typeorm';
import { RawInvoice } from './entities/raw-invoice.entity';
import { AiDecisionLog } from './entities/ai-decision-log.entity';
import { FinanceService } from '../finance/finance.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { InvoiceParserService } from './invoice-parser.service';
interface RawInvoiceInput {
    externalId: string;
    supplierId: string;
    invoiceDate: string;
    dueDate: string;
    currency: string;
    lines: {
        itemId: string;
        description: string;
        quantity: string;
        unitPrice: string;
        taxRate: string;
    }[];
}
export declare class InvoiceAutomationService {
    private readonly rawInvoiceRepo;
    private readonly decisionRepo;
    private readonly finance;
    private readonly tenantContext;
    private readonly parser;
    constructor(rawInvoiceRepo: Repository<RawInvoice>, decisionRepo: Repository<AiDecisionLog>, finance: FinanceService, tenantContext: TenantContextService, parser: InvoiceParserService);
    listRawInvoices(limit?: number): Promise<RawInvoice[]>;
    importFromXml(xml: string): Promise<{
        rawInvoiceId: string;
        decisionId: string;
        autoApplied: boolean;
        confidence: number;
        createdInvoice: unknown;
    } | null>;
    syncFromCassetto(count?: number): Promise<unknown[]>;
    private generateMockFatturaPa;
    setDecisionFeedback(id: string, feedback: 'CORRECT' | 'INCORRECT'): Promise<AiDecisionLog>;
    listDecisionLogs(limit?: number): Promise<AiDecisionLog[]>;
    importAndAutoRegister(input: RawInvoiceInput): Promise<{
        rawInvoiceId: string;
        decisionId: string;
        autoApplied: boolean;
        confidence: number;
        createdInvoice: unknown;
    }>;
}
export {};
