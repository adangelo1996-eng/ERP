import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { CostCenter } from './cost-center.entity';
import { Project } from './project.entity';

@Entity({ name: 'fin_budgets' })
export class Budget extends BaseEntityWithTenant {
  @Column({ type: 'int' })
  year!: number;

  @ManyToOne(() => CostCenter, { nullable: true })
  costCenter?: CostCenter | null;

  @ManyToOne(() => Project, { nullable: true })
  project?: Project | null;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount!: string;
}

