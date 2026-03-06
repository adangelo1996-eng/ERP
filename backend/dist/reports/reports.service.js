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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const journal_line_entity_1 = require("../finance/entities/journal-line.entity");
const account_entity_1 = require("../finance/entities/account.entity");
const time_entry_entity_1 = require("../hr/entities/time-entry.entity");
const employee_entity_1 = require("../hr/entities/employee.entity");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
const budget_entity_1 = require("../finance/entities/budget.entity");
const cost_center_entity_1 = require("../finance/entities/cost-center.entity");
const project_entity_1 = require("../finance/entities/project.entity");
const customer_invoice_entity_1 = require("../finance/entities/customer-invoice.entity");
const supplier_invoice_entity_1 = require("../finance/entities/supplier-invoice.entity");
let ReportsService = class ReportsService {
    journalLineRepo;
    accountRepo;
    timeRepo;
    employeeRepo;
    budgetRepo;
    costCenterRepo;
    projectRepo;
    customerInvoiceRepo;
    supplierInvoiceRepo;
    tenantContext;
    constructor(journalLineRepo, accountRepo, timeRepo, employeeRepo, budgetRepo, costCenterRepo, projectRepo, customerInvoiceRepo, supplierInvoiceRepo, tenantContext) {
        this.journalLineRepo = journalLineRepo;
        this.accountRepo = accountRepo;
        this.timeRepo = timeRepo;
        this.employeeRepo = employeeRepo;
        this.budgetRepo = budgetRepo;
        this.costCenterRepo = costCenterRepo;
        this.projectRepo = projectRepo;
        this.customerInvoiceRepo = customerInvoiceRepo;
        this.supplierInvoiceRepo = supplierInvoiceRepo;
        this.tenantContext = tenantContext;
    }
    async trialBalance(from, to) {
        const tenantId = this.tenantContext.getTenantId();
        const where = { tenantId };
        if (from || to) {
            const fromDate = from || '1900-01-01';
            const toDate = to || '9999-12-31';
            where.entry = { postingDate: (0, typeorm_2.Between)(fromDate, toDate) };
        }
        const lines = await this.journalLineRepo.find({
            where,
            relations: ['account', 'entry'],
        });
        const byAccount = new Map();
        for (const l of lines) {
            const key = l.account.id;
            if (!byAccount.has(key)) {
                byAccount.set(key, {
                    accountId: l.account.id,
                    code: l.account.code,
                    name: l.account.name,
                    debit: 0,
                    credit: 0,
                });
            }
            const agg = byAccount.get(key);
            agg.debit += Number(l.debit);
            agg.credit += Number(l.credit);
        }
        return Array.from(byAccount.values());
    }
    async budgetByCostCenter(year) {
        const tenantId = this.tenantContext.getTenantId();
        const budgets = await this.budgetRepo.find({
            where: { tenantId, year },
            relations: ['costCenter'],
        });
        const byCc = new Map();
        for (const b of budgets) {
            if (!b.costCenter)
                continue;
            const key = b.costCenter.id;
            if (!byCc.has(key)) {
                byCc.set(key, {
                    costCenterId: b.costCenter.id,
                    code: b.costCenter.code,
                    name: b.costCenter.name,
                    budgetAmount: 0,
                });
            }
            const agg = byCc.get(key);
            agg.budgetAmount += Number(b.amount);
        }
        return Array.from(byCc.values());
    }
    async budgetByProject(year) {
        const tenantId = this.tenantContext.getTenantId();
        const budgets = await this.budgetRepo.find({
            where: { tenantId, year },
            relations: ['project', 'project.costCenter'],
        });
        const byProject = new Map();
        for (const b of budgets) {
            if (!b.project)
                continue;
            const key = b.project.id;
            if (!byProject.has(key)) {
                byProject.set(key, {
                    projectId: b.project.id,
                    code: b.project.code,
                    name: b.project.name,
                    costCenterCode: b.project.costCenter?.code,
                    budgetAmount: 0,
                });
            }
            const agg = byProject.get(key);
            agg.budgetAmount += Number(b.amount);
        }
        return Array.from(byProject.values());
    }
    async agingCustomers() {
        const tenantId = this.tenantContext.getTenantId();
        const today = new Date();
        const invoices = await this.customerInvoiceRepo.find({
            where: { tenantId },
        });
        const byCustomer = new Map();
        for (const inv of invoices) {
            if (inv.status === 'PAID' || inv.status === 'CANCELLED')
                continue;
            const due = new Date(inv.dueDate);
            const days = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)) || 0;
            const key = inv.customerId;
            if (!byCustomer.has(key)) {
                byCustomer.set(key, {
                    customerId: key,
                    current: 0,
                    d1_30: 0,
                    d31_60: 0,
                    d61_90: 0,
                    d91_plus: 0,
                });
            }
            const agg = byCustomer.get(key);
            const amount = Number(inv.totalNet) + Number(inv.totalTax);
            if (days <= 0)
                agg.current += amount;
            else if (days <= 30)
                agg.d1_30 += amount;
            else if (days <= 60)
                agg.d31_60 += amount;
            else if (days <= 90)
                agg.d61_90 += amount;
            else
                agg.d91_plus += amount;
        }
        return Array.from(byCustomer.values());
    }
    async agingSuppliers() {
        const tenantId = this.tenantContext.getTenantId();
        const today = new Date();
        const invoices = await this.supplierInvoiceRepo.find({
            where: { tenantId },
        });
        const bySupplier = new Map();
        for (const inv of invoices) {
            if (inv.status === 'PAID' || inv.status === 'CANCELLED')
                continue;
            const due = new Date(inv.dueDate);
            const days = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)) || 0;
            const key = inv.supplierId;
            if (!bySupplier.has(key)) {
                bySupplier.set(key, {
                    supplierId: key,
                    current: 0,
                    d1_30: 0,
                    d31_60: 0,
                    d61_90: 0,
                    d91_plus: 0,
                });
            }
            const agg = bySupplier.get(key);
            const amount = Number(inv.totalNet) + Number(inv.totalTax);
            if (days <= 0)
                agg.current += amount;
            else if (days <= 30)
                agg.d1_30 += amount;
            else if (days <= 60)
                agg.d31_60 += amount;
            else if (days <= 90)
                agg.d61_90 += amount;
            else
                agg.d91_plus += amount;
        }
        return Array.from(bySupplier.values());
    }
    async workingHoursByEmployee() {
        const tenantId = this.tenantContext.getTenantId();
        const entries = await this.timeRepo.find({
            where: { tenantId, status: 'APPROVED' },
            relations: ['employee'],
        });
        const byEmployee = new Map();
        for (const e of entries) {
            if (!e.clockOut)
                continue;
            const diffMs = e.clockOut.getTime() - e.clockIn.getTime();
            const hours = diffMs / (1000 * 60 * 60);
            const key = e.employee.id;
            if (!byEmployee.has(key)) {
                byEmployee.set(key, {
                    employeeId: e.employee.id,
                    name: e.employee.fullName,
                    hours: 0,
                });
            }
            const agg = byEmployee.get(key);
            agg.hours += hours;
        }
        return Array.from(byEmployee.values());
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(journal_line_entity_1.JournalLine)),
    __param(1, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __param(2, (0, typeorm_1.InjectRepository)(time_entry_entity_1.TimeEntry)),
    __param(3, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(4, (0, typeorm_1.InjectRepository)(budget_entity_1.Budget)),
    __param(5, (0, typeorm_1.InjectRepository)(cost_center_entity_1.CostCenter)),
    __param(6, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(7, (0, typeorm_1.InjectRepository)(customer_invoice_entity_1.CustomerInvoice)),
    __param(8, (0, typeorm_1.InjectRepository)(supplier_invoice_entity_1.SupplierInvoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        tenant_context_service_1.TenantContextService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map