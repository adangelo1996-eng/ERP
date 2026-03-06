"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceParserService = void 0;
const common_1 = require("@nestjs/common");
const fast_xml_parser_1 = require("fast-xml-parser");
let InvoiceParserService = class InvoiceParserService {
    parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false });
    parseXml(xml) {
        try {
            const doc = this.parser.parse(xml);
            const root = doc?.FatturaElettronica ?? doc?.['p:FatturaElettronica'];
            if (!root)
                return null;
            const header = root.FatturaElettronicaHeader ?? root['p:FatturaElettronicaHeader'];
            const body = root.FatturaElettronicaBody ?? root['p:FatturaElettronicaBody'];
            const cedente = header?.CedentePrestatore?.DatiAnagrafici ?? {};
            const idFiscale = cedente.IdFiscaleIVA ?? {};
            const supplierVat = idFiscale.IdCodice ?? idFiscale['#text'] ?? '';
            const supplierName = cedente.Anagrafica?.Denominazione ?? cedente.Anagrafica?.Nome ?? '';
            const datiGen = body?.DatiGenerali?.DatiGeneraliDocumento ?? {};
            const invoiceDate = this.formatDate(datiGen.Data ?? '');
            const currency = datiGen.Divisa ?? 'EUR';
            const lines = [];
            let totalNet = 0;
            let totalTax = 0;
            const linee = body?.DatiBeniServizi?.DettaglioLinee ?? [];
            const items = Array.isArray(linee) ? linee : [linee];
            for (const line of items) {
                if (!line)
                    continue;
                const qty = parseFloat(line.Quantita ?? '1');
                const price = parseFloat(line.PrezzoUnitario ?? '0');
                const desc = line.Descrizione ?? '';
                const tax = parseFloat(line.AliquotaIVA ?? '22');
                const net = qty * price;
                const taxAmt = net * (tax / 100);
                totalNet += net;
                totalTax += taxAmt;
                lines.push({
                    itemId: line.CodiceArticolo ?? 'SRV-001',
                    description: desc,
                    quantity: String(qty),
                    unitPrice: String(price),
                    taxRate: String(tax),
                });
            }
            const datiPag = body?.DatiPagamento ?? {};
            const pag = Array.isArray(datiPag) ? datiPag[0] : datiPag;
            const dueDate = pag?.DataScadenzaPagamento
                ? this.formatDate(pag.DataScadenzaPagamento)
                : invoiceDate;
            return {
                supplierId: supplierVat || supplierName || 'UNKNOWN',
                supplierVat: supplierVat || undefined,
                supplierName: supplierName || undefined,
                invoiceDate,
                dueDate,
                currency,
                lines,
                totalNet: totalNet.toFixed(2),
                totalTax: totalTax.toFixed(2),
            };
        }
        catch {
            return null;
        }
    }
    formatDate(d) {
        if (!d)
            return new Date().toISOString().slice(0, 10);
        if (d.length === 8)
            return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
        return d.slice(0, 10);
    }
};
exports.InvoiceParserService = InvoiceParserService;
exports.InvoiceParserService = InvoiceParserService = __decorate([
    (0, common_1.Injectable)()
], InvoiceParserService);
//# sourceMappingURL=invoice-parser.service.js.map