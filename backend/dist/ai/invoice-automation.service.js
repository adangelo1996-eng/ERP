"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceAutomationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const raw_invoice_entity_1 = require("./entities/raw-invoice.entity");
const ai_decision_log_entity_1 = require("./entities/ai-decision-log.entity");
const finance_service_1 = require("../finance/finance.service");
const tenant_context_service_1 = require("../core/tenant/tenant-context.service");
const invoice_parser_service_1 = require("./invoice-parser.service");
let InvoiceAutomationService = class InvoiceAutomationService {
    rawInvoiceRepo;
    decisionRepo;
    finance;
    tenantContext;
    parser;
    constructor(rawInvoiceRepo, decisionRepo, finance, tenantContext, parser) {
        this.rawInvoiceRepo = rawInvoiceRepo;
        this.decisionRepo = decisionRepo;
        this.finance = finance;
        this.tenantContext = tenantContext;
        this.parser = parser;
    }
    async listRawInvoices(limit = 50) {
        const tenantId = this.tenantContext.getTenantId();
        return this.rawInvoiceRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async importFromXml(xml) {
        const parsed = this.parser.parseXml(xml);
        if (!parsed)
            return null;
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
        const results = [];
        for (let i = 0; i < count; i++) {
            const mockXml = this.generateMockFatturaPa(i);
            const parsed = this.parser.parseXml(mockXml);
            if (!parsed)
                continue;
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
    generateMockFatturaPa(index) {
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
    async setDecisionFeedback(id, feedback) {
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
    async importAndAutoRegister(input) {
        const tenantId = this.tenantContext.getTenantId();
        const raw = await this.rawInvoiceRepo.save({
            tenantId,
            externalId: input.externalId,
            payload: input,
            status: 'IMPORTED',
        });
        const totalNet = input.lines
            .reduce((acc, l) => acc + Number(l.quantity) * Number(l.unitPrice), 0)
            .toString();
        const totalTax = input.lines
            .reduce((acc, l) => acc +
            Number(l.quantity) *
                Number(l.unitPrice) *
                (Number(l.taxRate) / 100), 0)
            .toString();
        const confidence = Number(totalNet) < 1000 ? 0.95 : Number(totalNet) < 5000 ? 0.8 : 0.6;
        const autoApply = confidence >= 0.9;
        const suggestion = {
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
        let createdInvoice = null;
        if (autoApply) {
            createdInvoice = await this.finance.registerSupplierInvoice({
                ...suggestion,
                lines: input.lines,
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
};
exports.InvoiceAutomationService = InvoiceAutomationService;
exports.InvoiceAutomationService = InvoiceAutomationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(raw_invoice_entity_1.RawInvoice)),
    __param(1, (0, typeorm_1.InjectRepository)(ai_decision_log_entity_1.AiDecisionLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        finance_service_1.FinanceService,
        tenant_context_service_1.TenantContextService,
        invoice_parser_service_1.InvoiceParserService])
], InvoiceAutomationService);
//# sourceMappingURL=invoice-automation.service.js.map