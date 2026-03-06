import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntityWithTenant } from '../../core/database/base-entity';
import { JournalEntry } from './journal-entry.entity';

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'POSTED' | 'PAID' | 'CANCELLED';

@Entity({ name: 'fin_customer_invoices' })
export class CustomerInvoice extends BaseEntityWithTenant {
  @Column({ type: 'varchar', length: 64 })
  customerId!: string;

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
  status!: InvoiceStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  salesOrderId?: string;

  @ManyToOne(() => JournalEntry, { nullable: true })
  postingEntry?: JournalEntry | null;

  @OneToMany(() => CustomerInvoiceLine, (line) => line.invoice, {
    cascade: true,
  })
  lines!: CustomerInvoiceLine[];
}

@Entity({ name: 'fin_customer_invoice_lines' })
export class CustomerInvoiceLine extends BaseEntityWithTenant {
  @ManyToOne(() => CustomerInvoice, (invoice) => invoice.lines, {
    nullable: false,
  })
  invoice!: CustomerInvoice;

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

