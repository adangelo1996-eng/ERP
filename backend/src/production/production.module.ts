import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { ProductionItem } from './entities/production-item.entity';
import { BillOfMaterial, BOMComponent } from './entities/bom.entity';
import { WorkCenter } from './entities/work-center.entity';
import { Routing, Operation } from './entities/routing.entity';
import {
  ManufacturingOrder,
  MOOperation,
} from './entities/manufacturing-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionItem,
      BillOfMaterial,
      BOMComponent,
      WorkCenter,
      Routing,
      Operation,
      ManufacturingOrder,
      MOOperation,
    ]),
  ],
  providers: [ProductionService],
  controllers: [ProductionController],
  exports: [ProductionService],
})
export class ProductionModule {}

