export interface ParsedInvoice {
    supplierId: string;
    supplierVat?: string;
    supplierName?: string;
    invoiceDate: string;
    dueDate?: string;
    currency: string;
    lines: {
        itemId: string;
        description: string;
        quantity: string;
        unitPrice: string;
        taxRate: string;
    }[];
    totalNet: string;
    totalTax: string;
}
export declare class InvoiceParserService {
    private readonly parser;
    parseXml(xml: string): ParsedInvoice | null;
    private formatDate;
}
