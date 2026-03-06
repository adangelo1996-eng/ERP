import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONVERTED';

@Entity({ name: 'proc_purchase_requests' })
export class PurchaseRequest extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  requesterId!: string;

  @Column({ type: 'varchar', length: 64 })
  itemId!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4, nullable: true })
  estimatedValue?: string;

  @Column({ type: 'varchar', length: 32 })
  status!: PurchaseRequestStatus;
}

