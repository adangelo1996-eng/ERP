import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reports;
    constructor(reports: ReportsService);
    trialBalance(from?: string, to?: string): Promise<{
        accountId: string;
        code: string;
        name: string;
        debit: number;
        credit: number;
    }[]>;
    budgetByCostCenter(year?: string): Promise<{
        costCenterId: string;
        code: string;
        name: string;
        budgetAmount: number;
    }[]>;
    budgetByProject(year?: string): Promise<{
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
    workingHours(): Promise<{
        employeeId: string;
        name: string;
        hours: number;
    }[]>;
}
