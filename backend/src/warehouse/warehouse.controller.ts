import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouse: WarehouseService) {}

  @Get('warehouses')
  listWarehouses() {
    return this.warehouse.listWarehouses();
  }

  @Get('locations')
  listLocations(@Query('warehouse') warehouseCode?: string) {
    return this.warehouse.listLocations(warehouseCode);
  }

  @Get('stock')
  listStock(
    @Query('warehouse') warehouseCode?: string,
    @Query('item') itemId?: string,
  ) {
    return this.warehouse.listStock(warehouseCode, itemId);
  }

  @Get('movements')
  listMovements(@Query('type') type?: string) {
    return this.warehouse.listStockMovements(50, type);
  }

  @Post('receipts')
  receive(
    @Body()
    body: {
      warehouseCode: string;
      locationCode: string;
      itemId: string;
      quantity: string;
      batch?: string;
    },
  ) {
    return this.warehouse.receiveGoods(body);
  }
}

