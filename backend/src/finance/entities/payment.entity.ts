import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

export type PaymentDirection = 'INBOUND' | 'OUTBOUND';

@Entity({ name: 'fin_payments' })
export class Payment extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  counterpartyId!: string;

  @Column({ type: 'varchar', length: 16 })
  direction!: PaymentDirection;

  @Column({ type: 'date' })
  paymentDate!: string;

  @Column({ type: 'varchar', length: 16 })
  currency!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  amount!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  relatedInvoiceId?: string;
}

