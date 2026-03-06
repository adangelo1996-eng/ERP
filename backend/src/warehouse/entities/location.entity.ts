import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Warehouse } from './warehouse.entity';

@Entity({ name: 'wh_locations' })
export class Location extends BaseEntityWithTenant {
  @ManyToOne(() => Warehouse, { nullable: false })
  warehouse!: Warehouse;

  @Column({ type: 'varchar', length: 64 })
  code!: string;
}

