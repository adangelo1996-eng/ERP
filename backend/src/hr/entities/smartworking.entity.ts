import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';

@Entity({ name: 'hr_smartworking_policies' })
export class SmartworkingPolicy extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 256 })
  name!: string;

  @Column({ type: 'int' })
  maxDaysPerWeek!: number;
}

@Entity({ name: 'hr_smartworking_sessions' })
export class SmartworkingSession extends BaseEntityWithTenant {
  @ManyToOne(() => Employee, { nullable: false })
  employee!: Employee;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  deviceId?: string;
}

