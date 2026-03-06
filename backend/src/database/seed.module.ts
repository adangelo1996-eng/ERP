import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Ledger } from '../finance/entities/ledger.entity';
import { Account } from '../finance/entities/account.entity';
import { Supplier } from '../procurement/entities/supplier.entity';
import { ProductionItem } from '../production/entities/production-item.entity';
import { WorkCenter } from '../production/entities/work-center.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Location } from '../warehouse/entities/location.entity';
import { Employee } from '../hr/entities/employee.entity';
import { User } from '../auth/entities/user.entity';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ledger,
      Account,
      Supplier,
      ProductionItem,
      WorkCenter,
      Warehouse,
      Location,
      Employee,
      User,
      ApprovalWorkflow,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
