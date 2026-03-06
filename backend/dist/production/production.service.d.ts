import { Repository } from 'typeorm';
import { ManufacturingOrder } from './entities/manufacturing-order.entity';
import { ProductionItem } from './entities/production-item.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
export declare class ProductionService {
    private readonly moRepo;
    private readonly itemRepo;
    private readonly events;
    private readonly tenantContext;
    constructor(moRepo: Repository<ManufacturingOrder>, itemRepo: Repository<ProductionItem>, events: EventBusService, tenantContext: TenantContextService);
    listProductionItems(limit?: number): Promise<ProductionItem[]>;
    getManufacturingOrder(id: string): Promise<ManufacturingOrder>;
    listManufacturingOrders(limit?: number, status?: string): Promise<ManufacturingOrder[]>;
    createManufacturingOrder(input: {
        itemId: string;
        quantity: string;
        dueDate: string;
    }): Promise<ManufacturingOrder>;
    releaseManufacturingOrder(moId: string): Promise<ManufacturingOrder>;
    completeManufacturingOrder(moId: string): Promise<ManufacturingOrder>;
}
