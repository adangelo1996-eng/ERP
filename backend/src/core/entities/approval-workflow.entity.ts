import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../database/base-entity';

export type WorkflowType = 'PR' | 'LEAVE' | 'TIME_ENTRY' | 'INVESTMENT';

@Entity({ name: 'core_approval_workflows' })
export class ApprovalWorkflow extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 32 })
  type!: WorkflowType;

  @Column({ type: 'numeric', precision: 18, scale: 4, nullable: true })
  thresholdAmount?: string;

  @Column({ type: 'varchar', length: 256 })
  approverRoles!: string; // comma-separated roles
}
