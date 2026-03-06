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
exports.CustomerInvoiceLine = exports.CustomerInvoice = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const journal_entry_entity_1 = require("./journal-entry.entity");
let CustomerInvoice = class CustomerInvoice extends base_entity_1.BaseEntityWithTenant {
    customerId;
    invoiceDate;
    dueDate;
    currency;
    totalNet;
    totalTax;
    status;
    salesOrderId;
    postingEntry;
    lines;
};
exports.CustomerInvoice = CustomerInvoice;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "invoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16 }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "totalNet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "totalTax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], CustomerInvoice.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry, { nullable: true }),
    __metadata("design:type", Object)
], CustomerInvoice.prototype, "postingEntry", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CustomerInvoiceLine, (line) => line.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], CustomerInvoice.prototype, "lines", void 0);
exports.CustomerInvoice = CustomerInvoice = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_customer_invoices' })
], CustomerInvoice);
let CustomerInvoiceLine = class CustomerInvoiceLine extends base_entity_1.BaseEntityWithTenant {
    invoice;
    itemId;
    description;
    quantity;
    unitPrice;
    taxRate;
};
exports.CustomerInvoiceLine = CustomerInvoiceLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => CustomerInvoice, (invoice) => invoice.lines, {
        nullable: false,
    }),
    __metadata("design:type", CustomerInvoice)
], CustomerInvoiceLine.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], CustomerInvoiceLine.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 256 }),
    __metadata("design:type", String)
], CustomerInvoiceLine.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], CustomerInvoiceLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 4 }),
    __metadata("design:type", String)
], CustomerInvoiceLine.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2 }),
    __metadata("design:type", String)
], CustomerInvoiceLine.prototype, "taxRate", void 0);
exports.CustomerInvoiceLine = CustomerInvoiceLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_customer_invoice_lines' })
], CustomerInvoiceLine);
//# sourceMappingURL=customer-invoice.entity.js.map