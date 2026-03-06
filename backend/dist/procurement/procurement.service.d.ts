import { Repository } from 'typeorm';
import { PurchaseRequest } from './entities/purchase-request.entity';
import { PurchaseOrder, PurchaseOrderLine } from './entities/purchase-order.entity';
import { Supplier } from './entities/supplier.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { ApprovalWorkflowService } from '../approvals/approval-workflow.service';
export declare class ProcurementService {
    private readonly prRepo;
    private readonly poRepo;
    private readonly lineRepo;
    private readonly supplierRepo;
    private readonly events;
    private readonly tenantContext;
    private readonly approvalWorkflow;
    constructor(prRepo: Repository<PurchaseRequest>, poRepo: Repository<PurchaseOrder>, lineRepo: Repository<PurchaseOrderLine>, supplierRepo: Repository<Supplier>, events: EventBusService, tenantContext: TenantContextService, approvalWorkflow: ApprovalWorkflowService);
    listPurchaseRequests(limit?: number): Promise<PurchaseRequest[]>;
    listPurchaseOrders(limit?: number): Promise<PurchaseOrder[]>;
    listSuppliers(limit?: number): Promise<Supplier[]>;
    createPurchaseRequest(input: {
        requesterId: string;
        itemId: string;
        quantity: string;
        estimatedValue?: string;
    }): Promise<PurchaseRequest>;
    approvePurchaseRequest(id: string, approvedBy?: string): Promise<PurchaseRequest>;
    createPurchaseOrder(input: {
        supplierId: string;
        lines: {
            itemId: string;
            quantity: string;
            unitPrice: string;
        }[];
    }): Promise<PurchaseOrder>;
}
