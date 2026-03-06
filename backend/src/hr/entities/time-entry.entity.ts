import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';

export type TimeEntryStatus = 'RECORDED' | 'APPROVED' | 'REJECTED';

@Entity({ name: 'hr_time_entries' })
export class TimeEntry extends BaseEntityWithTenant {
  @ManyToOne(() => Employee, { nullable: false })
  employee!: Employee;

  @Column({ type: 'timestamptz' })
  clockIn!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  clockOut?: Date | null;

  @Column({ type: 'varchar', length: 32 })
  status!: TimeEntryStatus;
}

