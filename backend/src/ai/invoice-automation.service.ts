import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawInvoice } from './entities/raw-invoice.entity';
import { AiDecisionLog } from './entities/ai-decision-log.entity';
import { FinanceService } from '../finance/finance.service';
import { SupplierInvoice } from '../finance/entities/supplier-invoice.entity';
import { TenantContextService } from '../core/tenant/tenant-context.service';
import { InvoiceParserService } from './invoice-parser.service';

interface RawInvoiceInput {
  externalId: string;
  supplierId: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  lines: {
    itemId: string;
    description: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
  }[];
}

@Injectable()
export class InvoiceAutomationService {
  constructor(
    @InjectRepository(RawInvoice)
    private readonly rawInvoiceRepo: Repository<RawInvoice>,
    @InjectRepository(AiDecisionLog)
    private readonly decisionRepo: Repository<AiDecisionLog>,
    private readonly finance: FinanceService,
    private readonly tenantContext: TenantContextService,
    private readonly parser: InvoiceParserService,
  ) {}

  async listRawInvoices(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.rawInvoiceRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async importFromXml(xml: string) {
    const parsed = this.parser.parseXml(xml);
    if (!parsed) return null;
    const input = {
      externalId: `XML-${Date.now()}`,
      supplierId: parsed.supplierId,
      invoiceDate: parsed.invoiceDate,
      dueDate: parsed.dueDate ?? parsed.invoiceDate,
      currency: parsed.currency,
      lines: parsed.lines,
    };
    return this.importAndAutoRegister(input);
  }

  async syncFromCassetto(count = 5) {
    const tenantId = this.tenantContext.getTenantId();
    const results: unknown[] = [];
    for (let i = 0; i < count; i++) {
      const mockXml = this.generateMockFatturaPa(i);
      const parsed = this.parser.parseXml(mockXml);
      if (!parsed) continue;
      const input = {
        externalId: `SDI-SYNC-${Date.now()}-${i}`,
        supplierId: parsed.supplierId,
        invoiceDate: parsed.invoiceDate,
        dueDate: parsed.dueDate ?? parsed.invoiceDate,
        currency: parsed.currency,
        lines: parsed.lines,
      };
      const raw = await this.rawInvoiceRepo.save({
        tenantId,
        externalId: input.externalId,
        payload: input,
        status: 'IMPORTED',
      });
      const result = await this.importAndAutoRegister(input);
      results.push({ rawId: raw.id, ...result });
    }
    return results;
  }

  private generateMockFatturaPa(index: number): string {
    const amount = 500 + index * 300;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `<?xml version="1.0"?>
<FatturaElettronica>
  <FatturaElettronicaHeader>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA><IdCodice>IT12345678901</IdCodice></IdFiscaleIVA>
        <Anagrafica><Denominazione>Fornitore Test ${index}</Denominazione></Anagrafica>
      </DatiAnagrafici>
    </CedentePrestatore>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <Data>${date}</Data>
        <Divisa>EUR</Divisa>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
      <DettaglioLinee>
        <Descrizione>Servizio mock</Descrizione>
        <Quantita>1</Quantita>
        <PrezzoUnitario>${amount}</PrezzoUnitario>
        <AliquotaIVA>22</AliquotaIVA>
      </DettaglioLinee>
    </DatiBeniServizi>
  </FatturaElettronicaBody>
</FatturaElettronica>`;
  }

  async setDecisionFeedback(id: string, feedback: 'CORRECT' | 'INCORRECT') {
    const tenantId = this.tenantContext.getTenantId();
    const log = await this.decisionRepo.findOneOrFail({ where: { id, tenantId } });
    log.feedback = feedback;
    return this.decisionRepo.save(log);
  }

  async listDecisionLogs(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.decisionRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Simula un flusso AI:
   * - salva la fattura grezza
   * - calcola importi totali
   * - decide in modo euristico se auto‑applicare la registrazione
   * - registra la fattura fornitore in Finance
   */
  async importAndAutoRegister(input: RawInvoiceInput) {
    const tenantId = this.tenantContext.getTenantId();

    const raw: RawInvoice = await this.rawInvoiceRepo.save({
      tenantId,
      externalId: input.externalId,
      payload: input,
      status: 'IMPORTED',
    });

    const totalNet = input.lines
      .reduce((acc, l) => acc + Number(l.quantity) * Number(l.unitPrice), 0)
      .toString();
    const totalTax = input.lines
      .reduce(
        (acc, l) =>
          acc +
          Number(l.quantity) *
            Number(l.unitPrice) *
            (Number(l.taxRate) / 100),
        0,
      )
      .toString();

    // euristica semplice: fatture sotto soglia vengono auto‑registrate
    const confidence =
      Number(totalNet) < 1000 ? 0.95 : Number(totalNet) < 5000 ? 0.8 : 0.6;
    const autoApply = confidence >= 0.9;

    const suggestion: Partial<SupplierInvoice> = {
      supplierId: input.supplierId,
      invoiceDate: input.invoiceDate,
      dueDate: input.dueDate,
      currency: input.currency,
      totalNet,
      totalTax,
      status: autoApply ? 'POSTED' : 'REGISTERED',
    };

    const decision = await this.decisionRepo.save({
      tenantId,
      context: 'SUPPLIER_INVOICE',
      sourceId: raw.id,
      confidence: confidence.toFixed(2),
      autoApplied: autoApply,
      suggestion,
    });

    let createdInvoice: unknown = null;
    if (autoApply) {
      createdInvoice = await this.finance.registerSupplierInvoice({
        ...suggestion,
        // le righe verranno mappate in un passaggio successivo più evoluto
        lines: input.lines as any,
      });
      raw.status = 'PROCESSED';
      await this.rawInvoiceRepo.save(raw);
    }

    return {
      rawInvoiceId: raw.id,
      decisionId: decision.id,
      autoApplied: autoApply,
      confidence,
      createdInvoice,
    };
  }
}

