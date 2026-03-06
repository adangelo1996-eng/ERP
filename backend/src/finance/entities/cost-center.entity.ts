import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'fin_cost_centers' })
export class CostCenter extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 32 })
  code!: string;

  @Column({ type: 'varchar', length: 256 })
  name!: string;
}

