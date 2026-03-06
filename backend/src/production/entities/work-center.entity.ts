import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'prod_work_centers' })
export class WorkCenter extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  code!: string;

  @Column({ type: 'varchar', length: 256 })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  capacity!: string; // capacità teorica (es. ore/giorno)
}

