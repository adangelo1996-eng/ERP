import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceAutomationService } from './invoice-automation.service';
import { InvoiceParserService } from './invoice-parser.service';
import { AiController } from './ai.controller';
import { RawInvoice } from './entities/raw-invoice.entity';
import { AiDecisionLog } from './entities/ai-decision-log.entity';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RawInvoice, AiDecisionLog]),
    FinanceModule,
  ],
  providers: [InvoiceAutomationService, InvoiceParserService],
  controllers: [AiController],
})
export class AiModule {}

