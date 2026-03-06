import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockItem } from './entities/stock.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Location } from './entities/location.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(StockItem)
    private readonly stockRepo: Repository<StockItem>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
    @InjectRepository(StockMovement)
    private readonly movementRepo: Repository<StockMovement>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async listWarehouses() {
    const tenantId = this.tenantContext.getTenantId();
    return this.warehouseRepo.find({
      where: { tenantId },
      order: { code: 'ASC' },
    });
  }

  async listLocations(warehouseCode?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const where: any = { tenantId };
    if (warehouseCode) {
      where.warehouse = { code: warehouseCode };
    }
    return this.locationRepo.find({
      where,
      order: { code: 'ASC' },
      relations: ['warehouse'],
    });
  }

  async listStock(warehouseCode?: string, itemId?: string, limit = 100) {
    const tenantId = this.tenantContext.getTenantId();
    const qb = this.stockRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.location', 'loc')
      .leftJoinAndSelect('loc.warehouse', 'wh')
      .where('s.tenantId = :tenantId', { tenantId });
    if (warehouseCode) {
      qb.andWhere('wh.code = :warehouseCode', { warehouseCode });
    }
    if (itemId) {
      qb.andWhere('s.itemId = :itemId', { itemId });
    }
    qb.orderBy('s.updatedAt', 'DESC').take(limit);
    return qb.getMany();
  }

  async listStockMovements(limit = 50, type?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const where: any = { tenantId };
    if (type) where.type = type;
    return this.movementRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['fromLocation', 'toLocation'],
    });
  }

  async receiveGoods(input: {
    warehouseCode: string;
    locationCode: string;
    itemId: string;
    quantity: string;
    batch?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    const warehouse = await this.warehouseRepo.findOneByOrFail({
      tenantId,
      code: input.warehouseCode,
    });
    const location = await this.locationRepo.findOneByOrFail({
      tenantId,
      warehouse: { id: warehouse.id } as any,
      code: input.locationCode,
    });

    let stock = await this.stockRepo.findOne({
      where: {
        tenantId,
        location: { id: location.id } as any,
        itemId: input.itemId,
        batch: input.batch,
      },
    });

    if (!stock) {
      stock = this.stockRepo.create({
        tenantId,
        location,
        itemId: input.itemId,
        batch: input.batch,
        quantity: input.quantity,
      });
    } else {
      stock.quantity = (
        Number(stock.quantity) + Number(input.quantity)
      ).toString();
    }

    await this.stockRepo.save(stock);

    const receivingLoc = await this.locationRepo.findOne({
      where: { tenantId, warehouse: { id: warehouse.id }, code: 'RECEIVING' },
    });
    const fromLoc = receivingLoc ?? location;
    await this.movementRepo.save(
      this.movementRepo.create({
        tenantId,
        type: 'RECEIPT',
        fromLocation: fromLoc,
        toLocation: location,
        itemId: input.itemId,
        batch: input.batch,
        quantity: input.quantity,
      }),
    );

    await this.events.publish({
      name: 'StockLevelChanged',
      occurredAt: new Date(),
      tenantId,
      payload: {
        itemId: input.itemId,
        warehouseId: warehouse.id,
      },
    });

    return stock;
  }
}

