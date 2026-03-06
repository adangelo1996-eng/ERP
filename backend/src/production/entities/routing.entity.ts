import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { ProductionItem } from './production-item.entity';
import { WorkCenter } from './work-center.entity';

@Entity({ name: 'prod_routings' })
export class Routing extends BaseEntityWithTenant {
  @ManyToOne(() => ProductionItem, { nullable: false })
  item!: ProductionItem;

  @Column({ type: 'varchar', length: 32 })
  version!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Operation, (op) => op.routing, { cascade: true })
  operations!: Operation[];
}

@Entity({ name: 'prod_operations' })
export class Operation extends BaseEntityWithTenant {
  @ManyToOne(() => Routing, (r) => r.operations, { nullable: false })
  routing!: Routing;

  @ManyToOne(() => WorkCenter, { nullable: false })
  workCenter!: WorkCenter;

  @Column({ type: 'int' })
  sequence!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  setupTime!: string; // minuti

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  runTimePerUnit!: string; // minuti per unità
}

