import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';

@Entity({ name: 'hr_performance_goals' })
export class PerformanceGoal extends BaseEntityWithTenant {
  @ManyToOne(() => Employee, { nullable: false })
  employee!: Employee;

  @Column({ type: 'varchar', length: 256 })
  description!: string;
}

@Entity({ name: 'hr_performance_reviews' })
export class PerformanceReview extends BaseEntityWithTenant {
  @ManyToOne(() => Employee, { nullable: false })
  employee!: Employee;

  @Column({ type: 'date' })
  reviewDate!: string;

  @Column({ type: 'int' })
  score!: number;
}

