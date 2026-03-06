import { Body, Controller, Get, Post } from '@nestjs/common';
import { LogisticsService } from './logistics.service';

@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logistics: LogisticsService) {}

  @Get('shipments')
  listShipments() {
    return this.logistics.listShipments();
  }

  @Post('shipments')
  createShipment(
    @Body()
    body: {
      orderId: string;
    },
  ) {
    return this.logistics.createShipment(body);
  }
}

