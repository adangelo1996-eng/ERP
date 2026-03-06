import { FinanceService } from './finance.service';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

describe('FinanceService', () => {
  it('dovrebbe pubblicare un evento alla registrazione della prima nota', async () => {
    const ledgerRepo: any = {};
    const accountRepo: any = {};
    const journalRepo: any = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ id: 'je1', ...x })),
    };
    const lineRepo: any = {
      create: jest.fn((x) => x),
    };
    const customerInvoiceRepo: any = {};
    const supplierInvoiceRepo: any = {};
    const paymentRepo: any = {};
    const events: EventBusService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as any;
    const tenantContext: TenantContextService = {
      getTenantId: () => 'test-tenant',
      setTenantId: jest.fn(),
    } as any;

    const service = new FinanceService(
      ledgerRepo,
      accountRepo,
      journalRepo,
      lineRepo,
      customerInvoiceRepo,
      supplierInvoiceRepo,
      paymentRepo,
      events,
      tenantContext,
    );

    await service.postJournalEntry({
      ledgerId: 'led1',
      postingDate: '2025-01-01',
      reference: 'TEST',
      source: 'MANUAL',
      lines: [
        { accountId: 'a1', debit: '100', credit: '0' },
        { accountId: 'a2', debit: '0', credit: '100' },
      ],
    });

    expect(journalRepo.create).toHaveBeenCalled();
    expect(events.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'JournalEntryPosted',
        payload: { journalEntryId: 'je1' },
      }),
    );
  });
});

