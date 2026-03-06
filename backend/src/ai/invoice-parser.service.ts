import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

export interface ParsedInvoice {
  supplierId: string;
  supplierVat?: string;
  supplierName?: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  lines: {
    itemId: string;
    description: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
  }[];
  totalNet: string;
  totalTax: string;
}

@Injectable()
export class InvoiceParserService {
  private readonly parser = new XMLParser({ ignoreAttributes: false });

  parseXml(xml: string): ParsedInvoice | null {
    try {
      const doc = this.parser.parse(xml);
      const root = doc?.FatturaElettronica ?? (doc as any)?.['p:FatturaElettronica'];
      if (!root) return null;

      const header = root.FatturaElettronicaHeader ?? root['p:FatturaElettronicaHeader'];
      const body = root.FatturaElettronicaBody ?? root['p:FatturaElettronicaBody'];

      const cedente = header?.CedentePrestatore?.DatiAnagrafici ?? {};
      const idFiscale = cedente.IdFiscaleIVA ?? {};
      const supplierVat = idFiscale.IdCodice ?? idFiscale['#text'] ?? '';
      const supplierName =
        cedente.Anagrafica?.Denominazione ?? cedente.Anagrafica?.Nome ?? '';

      const datiGen = body?.DatiGenerali?.DatiGeneraliDocumento ?? {};
      const invoiceDate = this.formatDate(datiGen.Data ?? '');
      const currency = datiGen.Divisa ?? 'EUR';

      const lines: ParsedInvoice['lines'] = [];
      let totalNet = 0;
      let totalTax = 0;

      const linee = body?.DatiBeniServizi?.DettaglioLinee ?? [];
      const items = Array.isArray(linee) ? linee : [linee];
      for (const line of items) {
        if (!line) continue;
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
    } catch {
      return null;
    }
  }

  private formatDate(d: string): string {
    if (!d) return new Date().toISOString().slice(0, 10);
    if (d.length === 8) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
    return d.slice(0, 10);
  }
}
