import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'auth_users' })
export class User extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 256 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 64 })
  fullName!: string;

  @Column({ type: 'varchar', length: 32 })
  role!: string;
}
