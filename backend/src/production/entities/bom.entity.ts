import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { ProductionItem } from './production-item.entity';

@Entity({ name: 'prod_boms' })
export class BillOfMaterial extends BaseEntityWithTenant {
  @ManyToOne(() => ProductionItem, { nullable: false })
  parentItem!: ProductionItem;

  @Column({ type: 'varchar', length: 32 })
  version!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => BOMComponent, (c) => c.bom, { cascade: true })
  components!: BOMComponent[];
}

@Entity({ name: 'prod_bom_components' })
export class BOMComponent extends BaseEntityWithTenant {
  @ManyToOne(() => BillOfMaterial, (b) => b.components, { nullable: false })
  bom!: BillOfMaterial;

  @Column({ type: 'varchar', length: 64 })
  componentItemId!: string; // riferimento ad articolo/semilavorato

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;
}

