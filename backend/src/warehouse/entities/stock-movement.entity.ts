import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Location } from './location.entity';

export type StockMovementType =
  | 'RECEIPT'
  | 'ISSUE'
  | 'TRANSFER'
  | 'ADJUSTMENT';

@Entity({ name: 'wh_stock_movements' })
export class StockMovement extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 16 })
  type!: StockMovementType;

  @ManyToOne(() => Location, { nullable: false })
  fromLocation!: Location;

  @ManyToOne(() => Location, { nullable: true })
  toLocation?: Location | null;

  @Column({ type: 'varchar', length: 64 })
  itemId!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  batch?: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;
}

