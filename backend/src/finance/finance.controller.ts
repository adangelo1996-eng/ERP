import { Body, Controller, Get, Post } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Roles } from '../core/auth/roles.decorator';
import { PostJournalEntryDto } from './dto/post-journal-entry.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get('ledgers')
  listLedgers() {
    return this.finance.listLedgers();
  }

  @Get('accounts')
  listAccounts() {
    return this.finance.listAccounts();
  }

  @Get('journal-entries')
  @Roles('FINANCE_MANAGER')
  listJournalEntries() {
    return this.finance.listJournalEntries();
  }

  @Get('supplier-invoices')
  listSupplierInvoices() {
    return this.finance.listSupplierInvoices();
  }

  @Get('customer-invoices')
  listCustomerInvoices() {
    return this.finance.listCustomerInvoices();
  }

  @Get('payments')
  listPayments() {
    return this.finance.listPayments();
  }

  @Post('init-demo')
  initDemo() {
    return this.finance.initDemoData();
  }

  @Post('journal-entries')
  @Roles('FINANCE_MANAGER')
  postJournalEntry(
    @Body()
    body: PostJournalEntryDto,
  ) {
    return this.finance.postJournalEntry(body);
  }

  @Post('customer-invoices')
  registerCustomerInvoice(@Body() body: any) {
    return this.finance.registerCustomerInvoice(body);
  }

  @Post('supplier-invoices')
  registerSupplierInvoice(@Body() body: any) {
    return this.finance.registerSupplierInvoice(body);
  }

  @Post('payments')
  recordPayment(@Body() body: any) {
    return this.finance.recordPayment(body);
  }
}

