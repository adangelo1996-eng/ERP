import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { ProductionItem } from './production-item.entity';
import { Operation } from './routing.entity';

export type ManufacturingOrderStatus =
  | 'PLANNED'
  | 'RELEASED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CLOSED';

@Entity({ name: 'prod_mos' })
export class ManufacturingOrder extends BaseEntityWithTenant {
  @ManyToOne(() => ProductionItem, { nullable: false })
  item!: ProductionItem;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;

  @Column({ type: 'date' })
  dueDate!: string;

  @Column({ type: 'varchar', length: 32 })
  status!: ManufacturingOrderStatus;

  @OneToMany(() => MOOperation, (op) => op.mo, { cascade: true })
  operations!: MOOperation[];
}

@Entity({ name: 'prod_mo_operations' })
export class MOOperation extends BaseEntityWithTenant {
  @ManyToOne(() => ManufacturingOrder, (mo) => mo.operations, {
    nullable: false,
  })
  mo!: ManufacturingOrder;

  @ManyToOne(() => Operation, { nullable: false })
  operation!: Operation;

  @Column({ type: 'varchar', length: 32 })
  status!: 'PLANNED' | 'IN_PROGRESS' | 'DONE';

  @Column({ type: 'numeric', precision: 18, scale: 4, default: 0 })
  quantityCompleted!: string;
}

