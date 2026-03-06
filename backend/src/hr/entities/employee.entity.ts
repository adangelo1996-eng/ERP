import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'hr_employees' })
export class Employee extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  code!: string;

  @Column({ type: 'varchar', length: 256 })
  fullName!: string;

  @Column({ type: 'varchar', length: 64 })
  email!: string;
}

