import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ledger } from './entities/ledger.entity';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { CustomerInvoice } from './entities/customer-invoice.entity';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { Payment } from './entities/payment.entity';
import { EventBusService, DomainEvent } from '../core/events/event-bus.service';
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

@Injectable()
export class FinanceService implements OnModuleInit {
  constructor(
    @InjectRepository(Ledger)
    private readonly ledgerRepo: Repository<Ledger>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(JournalEntry)
    private readonly journalRepo: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly lineRepo: Repository<JournalLine>,
    @InjectRepository(CustomerInvoice)
    private readonly customerInvoiceRepo: Repository<CustomerInvoice>,
    @InjectRepository(SupplierInvoice)
    private readonly supplierInvoiceRepo: Repository<SupplierInvoice>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
  ) {}

  onModuleInit() {
    // Esempio: reagiamo a un evento di completamento MO per registrare variazioni WIP in futuro.
    this.events.subscribe('MOCompleted', (event: DomainEvent) => {
      // In questa fase ci limitiamo a dimostrare l'aggancio; la logica verrà raffinata.
      console.log('Finance received MOCompleted event', event);
    });
  }

  async listLedgers(): Promise<Ledger[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.ledgerRepo.find({ where: { tenantId }, order: { name: 'ASC' } });
  }

  async listAccounts(): Promise<Account[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.accountRepo.find({
      where: { tenantId },
      order: { code: 'ASC' },
      relations: ['ledger'],
    });
  }

  async listJournalEntries(limit = 50): Promise<JournalEntry[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.journalRepo.find({
      where: { tenantId },
      order: { postingDate: 'DESC', createdAt: 'DESC' },
      take: limit,
      relations: ['ledger', 'lines', 'lines.account'],
    });
  }

  async listSupplierInvoices(limit = 50): Promise<SupplierInvoice[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.supplierInvoiceRepo.find({
      where: { tenantId },
      order: { invoiceDate: 'DESC', createdAt: 'DESC' },
      take: limit,
      relations: ['lines'],
    });
  }

  async listCustomerInvoices(limit = 50): Promise<CustomerInvoice[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.customerInvoiceRepo.find({
      where: { tenantId },
      order: { invoiceDate: 'DESC', createdAt: 'DESC' },
      take: limit,
      relations: ['lines'],
    });
  }

  async listPayments(limit = 50): Promise<Payment[]> {
    const tenantId = this.tenantContext.getTenantId();
    return this.paymentRepo.find({
      where: { tenantId },
      order: { paymentDate: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async initDemoData(): Promise<{ ledger: Ledger; accounts: Account[] }> {
    const tenantId = this.tenantContext.getTenantId();
    const existing = await this.ledgerRepo.findOne({ where: { tenantId } });
    if (existing) {
      const accounts = await this.accountRepo.find({
        where: { tenantId, ledger: { id: existing.id } },
        order: { code: 'ASC' },
      });
      return { ledger: existing, accounts };
    }
    const ledger = await this.ledgerRepo.save(
      this.ledgerRepo.create({ tenantId, name: 'Piano dei conti principale', currency: 'EUR' }),
    );
    const accounts = await Promise.all([
      this.accountRepo.save(
        this.accountRepo.create({
          tenantId,
          ledger,
          code: '100',
          name: 'Cassa',
          type: 'ASSET',
        }),
      ),
      this.accountRepo.save(
        this.accountRepo.create({
          tenantId,
          ledger,
          code: '200',
          name: 'Fornitori',
          type: 'LIABILITY',
        }),
      ),
      this.accountRepo.save(
        this.accountRepo.create({
          tenantId,
          ledger,
          code: '300',
          name: 'Costi',
          type: 'EXPENSE',
        }),
      ),
    ]);
    return { ledger, accounts };
  }

  async postJournalEntry(dto: PostJournalEntryDto): Promise<JournalEntry> {
    const tenantId = this.tenantContext.getTenantId();

    const entry = this.journalRepo.create({
      tenantId,
      ledger: { id: dto.ledgerId } as any,
      postingDate: dto.postingDate,
      reference: dto.reference,
      source: dto.source as any,
      posted: true,
      lines: dto.lines.map((l) =>
        this.lineRepo.create({
          tenantId,
          account: { id: l.accountId } as any,
          debit: l.debit,
          credit: l.credit,
          description: l.description,
        }),
      ),
    } as any);

    const saved: JournalEntry = await this.journalRepo.save(entry as any);

    await this.events.publish({
      name: 'JournalEntryPosted',
      occurredAt: new Date(),
      tenantId,
      payload: { journalEntryId: saved.id },
    });

    return saved;
  }

  async registerCustomerInvoice(invoice: Partial<CustomerInvoice>) {
    const tenantId = this.tenantContext.getTenantId();
    const saved = await this.customerInvoiceRepo.save({
      ...invoice,
      tenantId,
    });
    await this.events.publish({
      name: 'CustomerInvoiceRegistered',
      occurredAt: new Date(),
      tenantId,
      payload: { invoiceId: saved.id },
    });
    return saved;
  }

  async registerSupplierInvoice(invoice: Partial<SupplierInvoice>) {
    const tenantId = this.tenantContext.getTenantId();
    const saved = await this.supplierInvoiceRepo.save({
      ...invoice,
      tenantId,
    });
    await this.events.publish({
      name: 'SupplierInvoiceRegistered',
      occurredAt: new Date(),
      tenantId,
      payload: { invoiceId: saved.id },
    });
    return saved;
  }

  async recordPayment(payment: Partial<Payment>) {
    const tenantId = this.tenantContext.getTenantId();
    const saved = await this.paymentRepo.save({
      ...payment,
      tenantId,
    });
    await this.events.publish({
      name: 'PaymentRecorded',
      occurredAt: new Date(),
      tenantId,
      payload: { paymentId: saved.id },
    });
    return saved;
  }
}

