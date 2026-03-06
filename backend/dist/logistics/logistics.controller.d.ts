import { LogisticsService } from './logistics.service';
export declare class LogisticsController {
    private readonly logistics;
    constructor(logistics: LogisticsService);
    listShipments(): Promise<import("./entities/shipment.entity").Shipment[]>;
    createShipment(body: {
        orderId: string;
    }): Promise<import("./entities/shipment.entity").Shipment>;
}
