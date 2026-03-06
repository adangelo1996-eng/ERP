import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { Employee } from './employee.entity';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Entity({ name: 'hr_leave_requests' })
export class LeaveRequest extends BaseEntityWithTenant {
  @ManyToOne(() => Employee, { nullable: false })
  employee!: Employee;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column({ type: 'varchar', length: 16 })
  type!: string; // ferie, malattia, ecc.

  @Column({ type: 'varchar', length: 16 })
  status!: LeaveStatus;
}

