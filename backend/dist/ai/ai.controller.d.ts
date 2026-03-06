import { InvoiceAutomationService } from './invoice-automation.service';
export declare class AiController {
    private readonly invoiceAutomation;
    constructor(invoiceAutomation: InvoiceAutomationService);
    listRawInvoices(): Promise<import("./entities/raw-invoice.entity").RawInvoice[]>;
    listDecisionLogs(): Promise<import("./entities/ai-decision-log.entity").AiDecisionLog[]>;
    importAndAutoRegister(body: any): Promise<{
        rawInvoiceId: string;
        decisionId: string;
        autoApplied: boolean;
        confidence: number;
        createdInvoice: unknown;
    }>;
    importFromXml(body: {
        xml: string;
    }): Promise<{
        rawInvoiceId: string;
        decisionId: string;
        autoApplied: boolean;
        confidence: number;
        createdInvoice: unknown;
    } | null>;
    syncFromCassetto(body: {
        count?: number;
    }): Promise<unknown[]>;
    setFeedback(id: string, body: {
        feedback: 'CORRECT' | 'INCORRECT';
    }): Promise<import("./entities/ai-decision-log.entity").AiDecisionLog>;
}
