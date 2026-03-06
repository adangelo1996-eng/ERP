"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entity_1 = require("./entities/ledger.entity");
const account_entity_1 = require("./entities/account.entity");
const journal_entry_entity_1 = require("./entities/journal-entry.entity");
const journal_line_entity_1 = require("./entities/journal-line.entity");
const customer_invoice_entity_1 = require("./entities/customer-invoice.entity");
const supplier_invoice_entity_1 = require("./entities/supplier-invoice.entity");
const payment_entity_1 = require("./entities/payment.entity");
const event_bus_service_1 = require("../core/events/event-bus.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
let FinanceService = class FinanceService {
    ledgerRepo;
    accountRepo;
    journalRepo;
    lineRepo;
    customerInvoiceRepo;
    supplierInvoiceRepo;
    paymentRepo;
    events;
    tenantContext;
    constructor(ledgerRepo, accountRepo, journalRepo, lineRepo, customerInvoiceRepo, supplierInvoiceRepo, paymentRepo, events, tenantContext) {
        this.ledgerRepo = ledgerRepo;
        this.accountRepo = accountRepo;
        this.journalRepo = journalRepo;
        this.lineRepo = lineRepo;
        this.customerInvoiceRepo = customerInvoiceRepo;
        this.supplierInvoiceRepo = supplierInvoiceRepo;
        this.paymentRepo = paymentRepo;
        this.events = events;
        this.tenantContext = tenantContext;
    }
    onModuleInit() {
        this.events.subscribe('MOCompleted', (event) => {
            console.log('Finance received MOCompleted event', event);
        });
    }
    async listLedgers() {
        const tenantId = this.tenantContext.getTenantId();
        return this.ledgerRepo.find({ where: { tenantId }, order: { name: 'ASC' } });
    }
    async listAccounts() {
        const tenantId = this.tenantContext.getTenantId();
        return this.accountRepo.find({
            where: { tenantId },
            order: { code: 'ASC' },
            relations: ['ledger'],
        });
    }
    async listJournalEntries(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.journalRepo.find({
            where: { tenantId },
            order: { postingDate: 'DESC', createdAt: 'DESC' },
            take: limit,
            relations: ['ledger', 'lines', 'lines.account'],
        });
    }
    async listSupplierInvoices(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.supplierInvoiceRepo.find({
            where: { tenantId },
            order: { invoiceDate: 'DESC', createdAt: 'DESC' },
            take: limit,
            relations: ['lines'],
        });
    }
    async listCustomerInvoices(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.customerInvoiceRepo.find({
            where: { tenantId },
            order: { invoiceDate: 'DESC', createdAt: 'DESC' },
            take: limit,
            relations: ['lines'],
        });
    }
    async listPayments(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.paymentRepo.find({
            where: { tenantId },
            order: { paymentDate: 'DESC', createdAt: 'DESC' },
            take: limit,
        });
    }
    async initDemoData() {
        const tenantId = this.tenantContext.getTenantId();
        const existing = await this.ledgerRepo.findOne({ where: { tenantId } });
        if (existing) {
            const accounts = await this.accountRepo.find({
                where: { tenantId, ledger: { id: existing.id } },
                order: { code: 'ASC' },
            });
            return { ledger: existing, accounts };
        }
        const ledger = await this.ledgerRepo.save(this.ledgerRepo.create({ tenantId, name: 'Piano dei conti principale', currency: 'EUR' }));
        const accounts = await Promise.all([
            this.accountRepo.save(this.accountRepo.create({
                tenantId,
                ledger,
                code: '100',
                name: 'Cassa',
                type: 'ASSET',
            })),
            this.accountRepo.save(this.accountRepo.create({
                tenantId,
                ledger,
                code: '200',
                name: 'Fornitori',
                type: 'LIABILITY',
            })),
            this.accountRepo.save(this.accountRepo.create({
                tenantId,
                ledger,
                code: '300',
                name: 'Costi',
                type: 'EXPENSE',
            })),
        ]);
        return { ledger, accounts };
    }
    async postJournalEntry(dto) {
        const tenantId = this.tenantContext.getTenantId();
        const entry = this.journalRepo.create({
            tenantId,
            ledger: { id: dto.ledgerId },
            postingDate: dto.postingDate,
            reference: dto.reference,
            source: dto.source,
            posted: true,
            lines: dto.lines.map((l) => this.lineRepo.create({
                tenantId,
                account: { id: l.accountId },
                debit: l.debit,
                credit: l.credit,
                description: l.description,
            })),
        });
        const saved = await this.journalRepo.save(entry);
        await this.events.publish({
            name: 'JournalEntryPosted',
            occurredAt: new Date(),
            tenantId,
            payload: { journalEntryId: saved.id },
        });
        return saved;
    }
    async registerCustomerInvoice(invoice) {
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
    async registerSupplierInvoice(invoice) {
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
    async recordPayment(payment) {
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
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entity_1.Ledger)),
    __param(1, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __param(2, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(3, (0, typeorm_1.InjectRepository)(journal_line_entity_1.JournalLine)),
    __param(4, (0, typeorm_1.InjectRepository)(customer_invoice_entity_1.CustomerInvoice)),
    __param(5, (0, typeorm_1.InjectRepository)(supplier_invoice_entity_1.SupplierInvoice)),
    __param(6, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_bus_service_1.EventBusService,
        tenant_context_service_1.TenantContextService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map