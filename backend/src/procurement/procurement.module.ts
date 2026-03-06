import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalsModule } from '../approvals/approvals.module';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { Supplier } from './entities/supplier.entity';
import { PurchaseRequest } from './entities/purchase-request.entity';
import {
  PurchaseOrder,
  PurchaseOrderLine,
} from './entities/purchase-order.entity';

@Module({
  imports: [
    ApprovalsModule,
    TypeOrmModule.forFeature([
      Supplier,
      PurchaseRequest,
      PurchaseOrder,
      PurchaseOrderLine,
    ]),
  ],
  providers: [ProcurementService],
  controllers: [ProcurementController],
  exports: [ProcurementService],
})
export class ProcurementModule {}

