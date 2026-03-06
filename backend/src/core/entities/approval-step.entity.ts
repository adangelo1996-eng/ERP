import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../database/base-entity';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Entity({ name: 'core_approval_steps' })
export class ApprovalStep extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  contextType!: string; // PR, LEAVE, etc.

  @Column({ type: 'varchar', length: 64 })
  contextId!: string;

  @Column({ type: 'int', default: 1 })
  stepOrder!: number;

  @Column({ type: 'varchar', length: 16 })
  status!: ApprovalStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamptz', nullable: true })
  approvedAt?: Date;
}
