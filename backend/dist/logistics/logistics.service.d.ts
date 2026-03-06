import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
export declare class LogisticsService {
    private readonly shipmentRepo;
    private readonly events;
    private readonly tenantContext;
    constructor(shipmentRepo: Repository<Shipment>, events: EventBusService, tenantContext: TenantContextService);
    listShipments(limit?: number): Promise<Shipment[]>;
    createShipment(input: {
        orderId: string;
    }): Promise<Shipment>;
}
