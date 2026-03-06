import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturingOrder } from './entities/manufacturing-order.entity';
import { ProductionItem } from './entities/production-item.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(ManufacturingOrder)
    private readonly moRepo: Repository<ManufacturingOrder>,
    @InjectRepository(ProductionItem)
    private readonly itemRepo: Repository<ProductionItem>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async listProductionItems(limit = 200) {
    const tenantId = this.tenantContext.getTenantId();
    return this.itemRepo.find({
      where: { tenantId },
      order: { itemId: 'ASC' },
      take: limit,
    });
  }

  async getManufacturingOrder(id: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.moRepo.findOneOrFail({
      where: { id, tenantId },
      relations: ['item'],
    });
  }

  async listManufacturingOrders(limit = 50, status?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const where: any = { tenantId };
    if (status) where.status = status;
    return this.moRepo.find({
      where,
      order: { dueDate: 'ASC', createdAt: 'DESC' },
      take: limit,
      relations: ['item'],
    });
  }

  async createManufacturingOrder(input: {
    itemId: string;
    quantity: string;
    dueDate: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    const item = await this.itemRepo.findOneByOrFail({
      tenantId,
      itemId: input.itemId,
    });

    const mo = this.moRepo.create({
      tenantId,
      item,
      quantity: input.quantity,
      dueDate: input.dueDate,
      status: 'PLANNED',
      operations: [],
    });

    const saved = await this.moRepo.save(mo);

    await this.events.publish({
      name: 'ManufacturingOrderPlanned',
      occurredAt: new Date(),
      tenantId,
      payload: { moId: saved.id },
    });

    return saved;
  }

  async releaseManufacturingOrder(moId: string) {
    const tenantId = this.tenantContext.getTenantId();
    const mo = await this.moRepo.findOneByOrFail({ id: moId, tenantId });
    mo.status = 'RELEASED';
    const saved = await this.moRepo.save(mo);

    await this.events.publish({
      name: 'ManufacturingOrderReleased',
      occurredAt: new Date(),
      tenantId,
      payload: { moId: saved.id },
    });

    return saved;
  }

  async completeManufacturingOrder(moId: string) {
    const tenantId = this.tenantContext.getTenantId();
    const mo = await this.moRepo.findOneByOrFail({ id: moId, tenantId });
    mo.status = 'COMPLETED';
    const saved = await this.moRepo.save(mo);

    await this.events.publish({
      name: 'MOCompleted',
      occurredAt: new Date(),
      tenantId,
      payload: { moId: saved.id },
    });

    return saved;
  }
}

