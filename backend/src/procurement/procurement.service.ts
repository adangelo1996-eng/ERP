import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseRequest } from './entities/purchase-request.entity';
import {
  PurchaseOrder,
  PurchaseOrderLine,
} from './entities/purchase-order.entity';
import { Supplier } from './entities/supplier.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { ApprovalWorkflowService } from '../approvals/approval-workflow.service';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLine)
    private readonly lineRepo: Repository<PurchaseOrderLine>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
    private readonly approvalWorkflow: ApprovalWorkflowService,
  ) {}

  async listPurchaseRequests(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.prRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async listPurchaseOrders(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.poRepo.find({
      where: { tenantId },
      order: { orderDate: 'DESC', createdAt: 'DESC' },
      take: limit,
      relations: ['supplier', 'lines'],
    });
  }

  async listSuppliers(limit = 100) {
    const tenantId = this.tenantContext.getTenantId();
    return this.supplierRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
      take: limit,
    });
  }

  async createPurchaseRequest(input: {
    requesterId: string;
    itemId: string;
    quantity: string;
    estimatedValue?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    const pr = this.prRepo.create({
      tenantId,
      requesterId: input.requesterId,
      itemId: input.itemId,
      quantity: input.quantity,
      estimatedValue: input.estimatedValue,
      status: 'SUBMITTED',
    });
    const saved = await this.prRepo.save(pr);
    const amount = input.estimatedValue ? Number(input.estimatedValue) : 0;
    const w = await this.approvalWorkflow.getWorkflowFor('PR', amount);
    if (w && amount >= Number(w.thresholdAmount || 0)) {
      await this.approvalWorkflow.createPendingStep('PR', saved.id);
    }
    await this.events.publish({
      name: 'PurchaseRequestSubmitted',
      occurredAt: new Date(),
      tenantId,
      payload: { purchaseRequestId: saved.id },
    });
    return saved;
  }

  async approvePurchaseRequest(id: string, approvedBy?: string) {
    const tenantId = this.tenantContext.getTenantId();
    const pr = await this.prRepo.findOneByOrFail({ id, tenantId });
    pr.status = 'APPROVED';
    const saved = await this.prRepo.save(pr);
    try {
      await this.approvalWorkflow.approve('PR', id, approvedBy || 'system');
    } catch {
      // step may not exist
    }
    await this.events.publish({
      name: 'PurchaseRequestApproved',
      occurredAt: new Date(),
      tenantId,
      payload: { purchaseRequestId: saved.id },
    });
    return saved;
  }

  async createPurchaseOrder(input: {
    supplierId: string;
    lines: { itemId: string; quantity: string; unitPrice: string }[];
  }) {
    const tenantId = this.tenantContext.getTenantId();
    const supplier = await this.supplierRepo.findOneByOrFail({
      id: input.supplierId,
      tenantId,
    });

    const po = this.poRepo.create({
      tenantId,
      supplier,
      orderDate: new Date().toISOString().slice(0, 10),
      status: 'OPEN',
      lines: input.lines.map((l) =>
        this.lineRepo.create({
          tenantId,
          itemId: l.itemId,
          quantity: l.quantity,
          quantityReceived: '0',
          unitPrice: l.unitPrice,
        }),
      ),
    });
    const saved = await this.poRepo.save(po);
    await this.events.publish({
      name: 'PurchaseOrderCreated',
      occurredAt: new Date(),
      tenantId,
      payload: { purchaseOrderId: saved.id },
    });
    return saved;
  }
}

