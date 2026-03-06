import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../core/auth/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('finance/trial-balance')
  @Roles('FINANCE_MANAGER')
  trialBalance(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reports.trialBalance(from, to);
  }

  @Get('finance/budget-by-cost-center')
  @Roles('FINANCE_MANAGER')
  budgetByCostCenter(@Query('year') year?: string) {
    const y = year ? Number(year) : new Date().getFullYear();
    return this.reports.budgetByCostCenter(y);
  }

  @Get('finance/budget-by-project')
  @Roles('FINANCE_MANAGER')
  budgetByProject(@Query('year') year?: string) {
    const y = year ? Number(year) : new Date().getFullYear();
    return this.reports.budgetByProject(y);
  }

  @Get('finance/aging-customers')
  @Roles('FINANCE_MANAGER')
  agingCustomers() {
    return this.reports.agingCustomers();
  }

  @Get('finance/aging-suppliers')
  @Roles('FINANCE_MANAGER')
  agingSuppliers() {
    return this.reports.agingSuppliers();
  }

  @Get('hr/working-hours')
  @Roles('HR_MANAGER')
  workingHours() {
    return this.reports.workingHoursByEmployee();
  }
}

