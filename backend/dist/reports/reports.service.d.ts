import { Repository } from 'typeorm';
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
export declare class ReportsService {
    private readonly journalLineRepo;
    private readonly accountRepo;
    private readonly timeRepo;
    private readonly employeeRepo;
    private readonly budgetRepo;
    private readonly costCenterRepo;
    private readonly projectRepo;
    private readonly customerInvoiceRepo;
    private readonly supplierInvoiceRepo;
    private readonly tenantContext;
    constructor(journalLineRepo: Repository<JournalLine>, accountRepo: Repository<Account>, timeRepo: Repository<TimeEntry>, employeeRepo: Repository<Employee>, budgetRepo: Repository<Budget>, costCenterRepo: Repository<CostCenter>, projectRepo: Repository<Project>, customerInvoiceRepo: Repository<CustomerInvoice>, supplierInvoiceRepo: Repository<SupplierInvoice>, tenantContext: TenantContextService);
    trialBalance(from?: string, to?: string): Promise<{
        accountId: string;
        code: string;
        name: string;
        debit: number;
        credit: number;
    }[]>;
    budgetByCostCenter(year: number): Promise<{
        costCenterId: string;
        code: string;
        name: string;
        budgetAmount: number;
    }[]>;
    budgetByProject(year: number): Promise<{
        projectId: string;
        code: string;
        name: string;
        costCenterCode?: string;
        budgetAmount: number;
    }[]>;
    agingCustomers(): Promise<{
        customerId: string;
        current: number;
        d1_30: number;
        d31_60: number;
        d61_90: number;
        d91_plus: number;
    }[]>;
    agingSuppliers(): Promise<{
        supplierId: string;
        current: number;
        d1_30: number;
        d31_60: number;
        d61_90: number;
        d91_plus: number;
    }[]>;
    workingHoursByEmployee(): Promise<{
        employeeId: string;
        name: string;
        hours: number;
    }[]>;
}
