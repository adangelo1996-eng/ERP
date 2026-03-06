import { ProductionService } from './production.service';
import { CreateManufacturingOrderDto } from './dto/create-mo.dto';
export declare class ProductionController {
    private readonly production;
    constructor(production: ProductionService);
    listMOs(status?: string): Promise<import("./entities/manufacturing-order.entity").ManufacturingOrder[]>;
    getMO(id: string): Promise<import("./entities/manufacturing-order.entity").ManufacturingOrder>;
    createMO(body: CreateManufacturingOrderDto): Promise<import("./entities/manufacturing-order.entity").ManufacturingOrder>;
    release(id: string): Promise<import("./entities/manufacturing-order.entity").ManufacturingOrder>;
    complete(id: string): Promise<import("./entities/manufacturing-order.entity").ManufacturingOrder>;
}
