import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { Roles } from '../core/auth/roles.decorator';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurement: ProcurementService) {}

  @Get('purchase-requests')
  listPurchaseRequests() {
    return this.procurement.listPurchaseRequests();
  }

  @Get('purchase-orders')
  listPurchaseOrders() {
    return this.procurement.listPurchaseOrders();
  }

  @Get('suppliers')
  listSuppliers() {
    return this.procurement.listSuppliers();
  }

  @Post('purchase-requests')
  createPR(
    @Body()
    body: {
      requesterId: string;
      itemId: string;
      quantity: string;
    },
  ) {
    return this.procurement.createPurchaseRequest(body);
  }

  @Patch('purchase-requests/:id/approve')
  @Roles('PROCUREMENT_MANAGER')
  approve(@Param('id') id: string) {
    return this.procurement.approvePurchaseRequest(id);
  }

  @Post('purchase-orders')
  @Roles('PROCUREMENT_MANAGER')
  createPO(
    @Body()
    body: CreatePurchaseOrderDto,
  ) {
    return this.procurement.createPurchaseOrder(body);
  }
}

