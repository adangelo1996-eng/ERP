import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Ledger } from '../finance/entities/ledger.entity';
import { Account } from '../finance/entities/account.entity';
import { JournalEntry } from '../finance/entities/journal-entry.entity';
import { JournalLine } from '../finance/entities/journal-line.entity';
import { Supplier } from '../procurement/entities/supplier.entity';
import { PurchaseRequest } from '../procurement/entities/purchase-request.entity';
import { ProductionItem } from '../production/entities/production-item.entity';
import { WorkCenter } from '../production/entities/work-center.entity';
import { ManufacturingOrder } from '../production/entities/manufacturing-order.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Location } from '../warehouse/entities/location.entity';
import { StockItem } from '../warehouse/entities/stock.entity';
import { Employee } from '../hr/entities/employee.entity';
import { TimeEntry } from '../hr/entities/time-entry.entity';
import { User } from '../auth/entities/user.entity';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';
import { Contract } from '../legal/entities/contract.entity';
import { LegalCase } from '../legal/entities/legal-case.entity';
import { InvestmentProposal } from '../investment/entities/investment-proposal.entity';
import { InvestmentScenario } from '../investment/entities/scenario.entity';
import { Shipment } from '../logistics/entities/shipment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ledger,
      Account,
      JournalEntry,
      JournalLine,
      Supplier,
      PurchaseRequest,
      ProductionItem,
      WorkCenter,
      ManufacturingOrder,
      Warehouse,
      Location,
      StockItem,
      Employee,
      TimeEntry,
      User,
      ApprovalWorkflow,
      Contract,
      LegalCase,
      InvestmentProposal,
      InvestmentScenario,
      Shipment,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
