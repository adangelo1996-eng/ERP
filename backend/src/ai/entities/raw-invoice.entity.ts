import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

export type RawInvoiceStatus = 'IMPORTED' | 'PROCESSED' | 'FAILED';

@Entity({ name: 'ai_raw_invoices' })
export class RawInvoice extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 128 })
  externalId!: string; // id nel cassetto fiscale

  @Column({ type: 'jsonb' })
  payload!: unknown;

  @Column({ type: 'varchar', length: 16 })
  status!: RawInvoiceStatus;
}

