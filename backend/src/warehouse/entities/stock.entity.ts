import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Location } from './location.entity';

@Entity({ name: 'wh_stock' })
export class StockItem extends BaseEntityWithTenant {
  @ManyToOne(() => Location, { nullable: false })
  location!: Location;

  @Column({ type: 'varchar', length: 64 })
  itemId!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  batch?: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;
}

