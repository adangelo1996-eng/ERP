import { WarehouseService } from './warehouse.service';
export declare class WarehouseController {
    private readonly warehouse;
    constructor(warehouse: WarehouseService);
    listWarehouses(): Promise<import("./entities/warehouse.entity").Warehouse[]>;
    listLocations(warehouseCode?: string): Promise<import("./entities/location.entity").Location[]>;
    listStock(warehouseCode?: string, itemId?: string): Promise<import("./entities/stock.entity").StockItem[]>;
    listMovements(type?: string): Promise<import("./entities/stock-movement.entity").StockMovement[]>;
    receive(body: {
        warehouseCode: string;
        locationCode: string;
        itemId: string;
        quantity: string;
        batch?: string;
    }): Promise<import("./entities/stock.entity").StockItem>;
}
