import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { Warehouse } from './entities/warehouse.entity';
import { Location } from './entities/location.entity';
import { StockItem } from './entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, Location, StockItem, StockMovement]),
  ],
  providers: [WarehouseService],
  controllers: [WarehouseController],
  exports: [WarehouseService],
})
export class WarehouseModule {}

