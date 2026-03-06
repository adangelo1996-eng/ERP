import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

@Injectable()
export class LogisticsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async listShipments(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.shipmentRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async createShipment(input: { orderId: string }) {
    const tenantId = this.tenantContext.getTenantId();
    const shipment = this.shipmentRepo.create({
      tenantId,
      orderId: input.orderId,
      status: 'PLANNED',
    });
    const saved = await this.shipmentRepo.save(shipment);
    await this.events.publish({
      name: 'ShipmentCreated',
      occurredAt: new Date(),
      tenantId,
      payload: { shipmentId: saved.id },
    });
    return saved;
  }
}

