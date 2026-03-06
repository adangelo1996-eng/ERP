import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { JournalLine } from '../finance/entities/journal-line.entity';
import { Account } from '../finance/entities/account.entity';
import { TimeEntry } from '../hr/entities/time-entry.entity';
import { Employee } from '../hr/entities/employee.entity';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { Budget } from '../finance/entities/budget.entity';
import { CostCenter } from '../finance/entities/cost-center.entity';
import { Project } from '../finance/entities/project.entity';
import { CustomerInvoice } from '../finance/entities/customer-invoice.entity';
import { SupplierInvoice } from '../finance/entities/supplier-invoice.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(JournalLine)
    private readonly journalLineRepo: Repository<JournalLine>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(TimeEntry)
    private readonly timeRepo: Repository<TimeEntry>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    @InjectRepository(CostCenter)
    private readonly costCenterRepo: Repository<CostCenter>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(CustomerInvoice)
    private readonly customerInvoiceRepo: Repository<CustomerInvoice>,
    @InjectRepository(SupplierInvoice)
    private readonly supplierInvoiceRepo: Repository<SupplierInvoice>,
    private readonly tenantContext: TenantContextService,
  ) {}

  async trialBalance(from?: string, to?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const where: any = { tenantId };
    if (from || to) {
      const fromDate = from || '1900-01-01';
      const toDate = to || '9999-12-31';
      where.entry = { postingDate: Between(fromDate, toDate) };
    }
    const lines = await this.journalLineRepo.find({
      where,
      relations: ['account', 'entry'],
    });

    const byAccount = new Map<
      string,
      { accountId: string; code: string; name: string; debit: number; credit: number }
    >();

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
      const agg = byAccount.get(key)!;
      agg.debit += Number(l.debit);
      agg.credit += Number(l.credit);
    }

    return Array.from(byAccount.values());
  }

  async budgetByCostCenter(year: number) {
    const tenantId = this.tenantContext.getTenantId();
    const budgets = await this.budgetRepo.find({
      where: { tenantId, year },
      relations: ['costCenter'],
    });

    const byCc = new Map<
      string,
      { costCenterId: string; code: string; name: string; budgetAmount: number }
    >();

    for (const b of budgets) {
      if (!b.costCenter) continue;
      const key = b.costCenter.id;
      if (!byCc.has(key)) {
        byCc.set(key, {
          costCenterId: b.costCenter.id,
          code: b.costCenter.code,
          name: b.costCenter.name,
          budgetAmount: 0,
        });
      }
      const agg = byCc.get(key)!;
      agg.budgetAmount += Number(b.amount);
    }

    return Array.from(byCc.values());
  }

  async budgetByProject(year: number) {
    const tenantId = this.tenantContext.getTenantId();
    const budgets = await this.budgetRepo.find({
      where: { tenantId, year },
      relations: ['project', 'project.costCenter'],
    });

    const byProject = new Map<
      string,
      {
        projectId: string;
        code: string;
        name: string;
        costCenterCode?: string;
        budgetAmount: number;
      }
    >();

    for (const b of budgets) {
      if (!b.project) continue;
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
      const agg = byProject.get(key)!;
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

    const byCustomer = new Map<
      string,
      {
        customerId: string;
        current: number;
        d1_30: number;
        d31_60: number;
        d61_90: number;
        d91_plus: number;
      }
    >();

    for (const inv of invoices) {
      if (inv.status === 'PAID' || inv.status === 'CANCELLED') continue;
      const due = new Date(inv.dueDate);
      const days =
        Math.floor(
          (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
        ) || 0;
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
      const agg = byCustomer.get(key)!;
      const amount = Number(inv.totalNet) + Number(inv.totalTax);
      if (days <= 0) agg.current += amount;
      else if (days <= 30) agg.d1_30 += amount;
      else if (days <= 60) agg.d31_60 += amount;
      else if (days <= 90) agg.d61_90 += amount;
      else agg.d91_plus += amount;
    }

    return Array.from(byCustomer.values());
  }

  async agingSuppliers() {
    const tenantId = this.tenantContext.getTenantId();
    const today = new Date();
    const invoices = await this.supplierInvoiceRepo.find({
      where: { tenantId },
    });

    const bySupplier = new Map<
      string,
      {
        supplierId: string;
        current: number;
        d1_30: number;
        d31_60: number;
        d61_90: number;
        d91_plus: number;
      }
    >();

    for (const inv of invoices) {
      if (inv.status === 'PAID' || inv.status === 'CANCELLED') continue;
      const due = new Date(inv.dueDate);
      const days =
        Math.floor(
          (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
        ) || 0;
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
      const agg = bySupplier.get(key)!;
      const amount = Number(inv.totalNet) + Number(inv.totalTax);
      if (days <= 0) agg.current += amount;
      else if (days <= 30) agg.d1_30 += amount;
      else if (days <= 60) agg.d31_60 += amount;
      else if (days <= 90) agg.d61_90 += amount;
      else agg.d91_plus += amount;
    }

    return Array.from(bySupplier.values());
  }

  async workingHoursByEmployee() {
    const tenantId = this.tenantContext.getTenantId();
    const entries = await this.timeRepo.find({
      where: { tenantId, status: 'APPROVED' },
      relations: ['employee'],
    });

    const byEmployee = new Map<
      string,
      { employeeId: string; name: string; hours: number }
    >();

    for (const e of entries) {
      if (!e.clockOut) continue;
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
      const agg = byEmployee.get(key)!;
      agg.hours += hours;
    }

    return Array.from(byEmployee.values());
  }
}

