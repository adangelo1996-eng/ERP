import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalEntry } from './journal-entry.entity';

export type SupplierInvoiceStatus =
  | 'DRAFT'
  | 'REGISTERED'
  | 'POSTED'
  | 'PAID'
  | 'CANCELLED';

@Entity({ name: 'fin_supplier_invoices' })
export class SupplierInvoice extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  supplierId!: string;

  @Column({ type: 'date' })
  invoiceDate!: string;

  @Column({ type: 'date' })
  dueDate!: string;

  @Column({ type: 'varchar', length: 16 })
  currency!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  totalNet!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  totalTax!: string;

  @Column({ type: 'varchar', length: 32 })
  status!: SupplierInvoiceStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  purchaseOrderId?: string;

  @ManyToOne(() => JournalEntry, { nullable: true })
  postingEntry?: JournalEntry | null;

  @OneToMany(() => SupplierInvoiceLine, (line) => line.invoice, {
    cascade: true,
  })
  lines!: SupplierInvoiceLine[];
}

@Entity({ name: 'fin_supplier_invoice_lines' })
export class SupplierInvoiceLine extends BaseEntityWithTenant {
  @ManyToOne(() => SupplierInvoice, (invoice) => invoice.lines, {
    nullable: false,
  })
  invoice!: SupplierInvoice;

  @Column({ type: 'varchar', length: 64 })
  itemId!: string;

  @Column({ type: 'varchar', length: 256 })
  description!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  unitPrice!: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  taxRate!: string;
}

