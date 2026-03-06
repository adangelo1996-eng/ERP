import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Ledger } from './entities/ledger.entity';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import {
  CustomerInvoice,
  CustomerInvoiceLine,
} from './entities/customer-invoice.entity';
import {
  SupplierInvoice,
  SupplierInvoiceLine,
} from './entities/supplier-invoice.entity';
import { Payment } from './entities/payment.entity';
import { CostCenter } from './entities/cost-center.entity';
import { Project } from './entities/project.entity';
import { Budget } from './entities/budget.entity';
import { FixedAsset } from './entities/fixed-asset.entity';
import { DepreciationPlan } from './entities/depreciation-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ledger,
      Account,
      JournalEntry,
      JournalLine,
      CustomerInvoice,
      CustomerInvoiceLine,
      SupplierInvoice,
      SupplierInvoiceLine,
      Payment,
      CostCenter,
      Project,
      Budget,
      FixedAsset,
      DepreciationPlan,
    ]),
  ],
  providers: [FinanceService],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}

