import { Column, Entity } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';

@Entity({ name: 'prod_items' })
export class ProductionItem extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  itemId!: string; // riferimento all'anagrafica articoli del master data

  @Column({ type: 'boolean', default: false })
  makeToOrder!: boolean;
}

