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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const roles_decorator_1 = require("../core/auth/roles.decorator");
const post_journal_entry_dto_1 = require("./dto/post-journal-entry.dto");
let FinanceController = class FinanceController {
    finance;
    constructor(finance) {
        this.finance = finance;
    }
    listLedgers() {
        return this.finance.listLedgers();
    }
    listAccounts() {
        return this.finance.listAccounts();
    }
    listJournalEntries() {
        return this.finance.listJournalEntries();
    }
    listSupplierInvoices() {
        return this.finance.listSupplierInvoices();
    }
    listCustomerInvoices() {
        return this.finance.listCustomerInvoices();
    }
    listPayments() {
        return this.finance.listPayments();
    }
    initDemo() {
        return this.finance.initDemoData();
    }
    postJournalEntry(body) {
        return this.finance.postJournalEntry(body);
    }
    registerCustomerInvoice(body) {
        return this.finance.registerCustomerInvoice(body);
    }
    registerSupplierInvoice(body) {
        return this.finance.registerSupplierInvoice(body);
    }
    recordPayment(body) {
        return this.finance.recordPayment(body);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('ledgers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listLedgers", null);
__decorate([
    (0, common_1.Get)('accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listAccounts", null);
__decorate([
    (0, common_1.Get)('journal-entries'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listJournalEntries", null);
__decorate([
    (0, common_1.Get)('supplier-invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listSupplierInvoices", null);
__decorate([
    (0, common_1.Get)('customer-invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listCustomerInvoices", null);
__decorate([
    (0, common_1.Get)('payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listPayments", null);
__decorate([
    (0, common_1.Post)('init-demo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "initDemo", null);
__decorate([
    (0, common_1.Post)('journal-entries'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_journal_entry_dto_1.PostJournalEntryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "postJournalEntry", null);
__decorate([
    (0, common_1.Post)('customer-invoices'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "registerCustomerInvoice", null);
__decorate([
    (0, common_1.Post)('supplier-invoices'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "registerSupplierInvoice", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "recordPayment", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map