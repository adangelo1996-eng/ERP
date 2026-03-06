import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { FixedAsset } from './fixed-asset.entity';

@Entity({ name: 'fin_depreciation_plans' })
export class DepreciationPlan extends BaseEntityWithTenant {
  @ManyToOne(() => FixedAsset, { nullable: false })
  asset!: FixedAsset;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  totalAmount!: string;
}

