import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { JournalLine } from '../finance/entities/journal-line.entity';
import { Account } from '../finance/entities/account.entity';
import { TimeEntry } from '../hr/entities/time-entry.entity';
import { Employee } from '../hr/entities/employee.entity';
import { Budget } from '../finance/entities/budget.entity';
import { CostCenter } from '../finance/entities/cost-center.entity';
import { Project } from '../finance/entities/project.entity';
import { CustomerInvoice } from '../finance/entities/customer-invoice.entity';
import { SupplierInvoice } from '../finance/entities/supplier-invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalLine,
      Account,
      TimeEntry,
      Employee,
      Budget,
      CostCenter,
      Project,
      CustomerInvoice,
      SupplierInvoice,
    ]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}

