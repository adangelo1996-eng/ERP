import { Repository } from 'typeorm';
import { StockItem } from './entities/stock.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Location } from './entities/location.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
export declare class WarehouseService {
    private readonly stockRepo;
    private readonly warehouseRepo;
    private readonly locationRepo;
    private readonly movementRepo;
    private readonly events;
    private readonly tenantContext;
    constructor(stockRepo: Repository<StockItem>, warehouseRepo: Repository<Warehouse>, locationRepo: Repository<Location>, movementRepo: Repository<StockMovement>, events: EventBusService, tenantContext: TenantContextService);
    listWarehouses(): Promise<Warehouse[]>;
    listLocations(warehouseCode?: string): Promise<Location[]>;
    listStock(warehouseCode?: string, itemId?: string, limit?: number): Promise<StockItem[]>;
    listStockMovements(limit?: number, type?: string): Promise<StockMovement[]>;
    receiveGoods(input: {
        warehouseCode: string;
        locationCode: string;
        itemId: string;
        quantity: string;
        batch?: string;
    }): Promise<StockItem>;
}
