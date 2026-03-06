import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Supplier } from './supplier.entity';

export type PurchaseOrderStatus =
  | 'OPEN'
  | 'PARTIALLY_RECEIVED'
  | 'CLOSED'
  | 'CANCELLED';

@Entity({ name: 'proc_purchase_orders' })
export class PurchaseOrder extends BaseEntityWithTenant {
  @ManyToOne(() => Supplier, { nullable: false })
  supplier!: Supplier;

  @Column({ type: 'date' })
  orderDate!: string;

  @Column({ type: 'varchar', length: 32 })
  status!: PurchaseOrderStatus;

  @OneToMany(() => PurchaseOrderLine, (l) => l.order, { cascade: true })
  lines!: PurchaseOrderLine[];
}

@Entity({ name: 'proc_purchase_order_lines' })
export class PurchaseOrderLine extends BaseEntityWithTenant {
  @ManyToOne(() => PurchaseOrder, (o) => o.lines, { nullable: false })
  order!: PurchaseOrder;

  @Column({ type: 'varchar', length: 64 })
  itemId!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantityReceived!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  unitPrice!: string;
}

