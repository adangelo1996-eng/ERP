import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'legal_cases' })
export class LegalCase extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 256 })
  title!: string;

  @Column({ type: 'varchar', length: 32 })
  status!: string;
}

