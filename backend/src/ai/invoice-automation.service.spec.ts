import { InvoiceAutomationService } from './invoice-automation.service';
import { FinanceService } from '../finance/finance.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

describe('InvoiceAutomationService', () => {
  it('auto‑registra fatture piccole con alta confidenza', async () => {
    const rawRepo: any = {
      save: jest.fn(async (x) => ({ id: 'raw1', ...x })),
    };
    const decisionRepo: any = {
      save: jest.fn(async (x) => ({ id: 'dec1', ...x })),
    };
    const finance: FinanceService = {
      postJournalEntry: jest.fn(),
      registerCustomerInvoice: jest.fn(),
      registerSupplierInvoice: jest.fn(async (x) => ({ id: 'supInv1', ...x })),
      recordPayment: jest.fn(),
      onModuleInit: jest.fn(),
    } as any;
    const tenantContext: TenantContextService = {
      getTenantId: () => 'test-tenant',
      setTenantId: jest.fn(),
    } as any;

    const service = new InvoiceAutomationService(
      rawRepo,
      decisionRepo,
      finance,
      tenantContext,
    );

    const result = await service.importAndAutoRegister({
      externalId: 'ext1',
      supplierId: 'sup1',
      invoiceDate: '2025-01-01',
      dueDate: '2025-01-31',
      currency: 'EUR',
      lines: [
        {
          itemId: 'it1',
          description: 'Servizio',
          quantity: '1',
          unitPrice: '100',
          taxRate: '22',
        },
      ],
    });

    expect(result.autoApplied).toBe(true);
    expect(result.createdInvoice).toBeTruthy();
  });
});

