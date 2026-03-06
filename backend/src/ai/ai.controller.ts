import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InvoiceAutomationService } from './invoice-automation.service';
import { Roles } from '../core/auth/roles.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly invoiceAutomation: InvoiceAutomationService) {}

  @Get('raw-invoices')
  @Roles('FINANCE_MANAGER')
  listRawInvoices() {
    return this.invoiceAutomation.listRawInvoices();
  }

  @Get('decision-logs')
  @Roles('FINANCE_MANAGER')
  listDecisionLogs() {
    return this.invoiceAutomation.listDecisionLogs();
  }

  @Post('invoices/import-and-auto-register')
  @Roles('FINANCE_MANAGER')
  importAndAutoRegister(@Body() body: any) {
    return this.invoiceAutomation.importAndAutoRegister(body);
  }

  @Post('invoices/import-xml')
  @Roles('FINANCE_MANAGER')
  importFromXml(@Body() body: { xml: string }) {
    return this.invoiceAutomation.importFromXml(body.xml);
  }

  @Post('invoices/sync')
  @Roles('FINANCE_MANAGER')
  syncFromCassetto(@Body() body: { count?: number }) {
    return this.invoiceAutomation.syncFromCassetto(body.count ?? 3);
  }

  @Patch('decision-logs/:id/feedback')
  @Roles('FINANCE_MANAGER')
  setFeedback(
    @Param('id') id: string,
    @Body() body: { feedback: 'CORRECT' | 'INCORRECT' },
  ) {
    return this.invoiceAutomation.setDecisionFeedback(id, body.feedback);
  }
}

