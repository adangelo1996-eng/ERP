import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'ai_decision_logs' })
export class AiDecisionLog extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  context!: string; // es. 'SUPPLIER_INVOICE'

  @Column({ type: 'varchar', length: 64 })
  sourceId!: string; // id fattura o documento

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  confidence!: string;

  @Column({ type: 'boolean' })
  autoApplied!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  suggestion?: unknown;

  @Column({ type: 'varchar', length: 16, nullable: true })
  feedback?: 'CORRECT' | 'INCORRECT';
}

