import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

export type ShipmentStatus =
  | 'PLANNED'
  | 'READY'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

@Entity({ name: 'log_shipments' })
export class Shipment extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  orderId!: string; // riferimento a ordine cliente o trasferimento

  @Column({ type: 'varchar', length: 64, nullable: true })
  carrierId?: string;

  @Column({ type: 'varchar', length: 32 })
  status!: ShipmentStatus;
}

