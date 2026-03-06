import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'fin_fixed_assets' })
export class FixedAsset extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  code!: string;

  @Column({ type: 'varchar', length: 256 })
  name!: string;

  @Column({ type: 'date' })
  acquisitionDate!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  acquisitionCost!: string;

  @Column({ type: 'int' })
  usefulLifeMonths!: number;
}

