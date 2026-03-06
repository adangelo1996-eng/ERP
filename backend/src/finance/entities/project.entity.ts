import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { CostCenter } from './cost-center.entity';

@Entity({ name: 'fin_projects' })
export class Project extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  code!: string;

  @Column({ type: 'varchar', length: 256 })
  name!: string;

  @ManyToOne(() => CostCenter, { nullable: true })
  costCenter?: CostCenter | null;
}

