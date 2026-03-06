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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierInvoiceLine = exports.SupplierInvoice = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const journal_entry_entity_1 = require("./journal-entry.entity");
let SupplierInvoice = class SupplierInvoice extends base_entity_1.BaseEntityWithTenant {
    supplierId;
    invoiceDate;
    dueDate;
    currency;
    totalNet;
    totalTax;
    status;
    purchaseOrderId;
    postingEntry;
    lines;
};
exports.SupplierInvoice = SupplierInvoice;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "invoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16 }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "totalNet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "totalTax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], SupplierInvoice.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry, { nullable: true }),
    __metadata("design:type", Object)
], SupplierInvoice.prototype, "postingEntry", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SupplierInvoiceLine, (line) => line.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], SupplierInvoice.prototype, "lines", void 0);
exports.SupplierInvoice = SupplierInvoice = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_supplier_invoices' })
], SupplierInvoice);
let SupplierInvoiceLine = class SupplierInvoiceLine extends base_entity_1.BaseEntityWithTenant {
    invoice;
    itemId;
    description;
    quantity;
    unitPrice;
    taxRate;
};
exports.SupplierInvoiceLine = SupplierInvoiceLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => SupplierInvoice, (invoice) => invoice.lines, {
        nullable: false,
    }),
    __metadata("design:type", SupplierInvoice)
], SupplierInvoiceLine.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], SupplierInvoiceLine.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 256 }),
    __metadata("design:type", String)
], SupplierInvoiceLine.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], SupplierInvoiceLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], SupplierInvoiceLine.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2 }),
    __metadata("design:type", String)
], SupplierInvoiceLine.prototype, "taxRate", void 0);
exports.SupplierInvoiceLine = SupplierInvoiceLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_supplier_invoice_lines' })
], SupplierInvoiceLine);
//# sourceMappingURL=supplier-invoice.entity.js.map