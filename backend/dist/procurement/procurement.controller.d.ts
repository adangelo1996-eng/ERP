import { ProcurementService } from './procurement.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
export declare class ProcurementController {
    private readonly procurement;
    constructor(procurement: ProcurementService);
    listPurchaseRequests(): Promise<import("./entities/purchase-request.entity").PurchaseRequest[]>;
    listPurchaseOrders(): Promise<import("./entities/purchase-order.entity").PurchaseOrder[]>;
    listSuppliers(): Promise<import("./entities/supplier.entity").Supplier[]>;
    createPR(body: {
        requesterId: string;
        itemId: string;
        quantity: string;
    }): Promise<import("./entities/purchase-request.entity").PurchaseRequest>;
    approve(id: string): Promise<import("./entities/purchase-request.entity").PurchaseRequest>;
    createPO(body: CreatePurchaseOrderDto): Promise<import("./entities/purchase-order.entity").PurchaseOrder>;
}
