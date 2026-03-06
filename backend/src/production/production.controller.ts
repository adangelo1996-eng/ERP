import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductionService } from './production.service';
import { Roles } from '../core/auth/roles.decorator';
import { CreateManufacturingOrderDto } from './dto/create-mo.dto';

@Controller('production')
export class ProductionController {
  constructor(private readonly production: ProductionService) {}

  @Get('items')
  listItems() {
    return this.production.listProductionItems();
  }

  @Get('mos')
  @Roles('PRODUCTION_PLANNER')
  listMOs(@Query('status') status?: string) {
    return this.production.listManufacturingOrders(50, status);
  }

  @Get('mos/:id')
  @Roles('PRODUCTION_PLANNER')
  getMO(@Param('id') id: string) {
    return this.production.getManufacturingOrder(id);
  }

  @Post('mos')
  @Roles('PRODUCTION_PLANNER')
  createMO(
    @Body()
    body: CreateManufacturingOrderDto,
  ) {
    return this.production.createManufacturingOrder(body);
  }

  @Patch('mos/:id/release')
  release(@Param('id') id: string) {
    return this.production.releaseManufacturingOrder(id);
  }

  @Patch('mos/:id/complete')
  complete(@Param('id') id: string) {
    return this.production.completeManufacturingOrder(id);
  }
}

