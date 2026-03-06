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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const invoice_automation_service_1 = require("./invoice-automation.service");
const roles_decorator_1 = require("../core/auth/roles.decorator");
let AiController = class AiController {
    invoiceAutomation;
    constructor(invoiceAutomation) {
        this.invoiceAutomation = invoiceAutomation;
    }
    listRawInvoices() {
        return this.invoiceAutomation.listRawInvoices();
    }
    listDecisionLogs() {
        return this.invoiceAutomation.listDecisionLogs();
    }
    importAndAutoRegister(body) {
        return this.invoiceAutomation.importAndAutoRegister(body);
    }
    importFromXml(body) {
        return this.invoiceAutomation.importFromXml(body.xml);
    }
    syncFromCassetto(body) {
        return this.invoiceAutomation.syncFromCassetto(body.count ?? 3);
    }
    setFeedback(id, body) {
        return this.invoiceAutomation.setDecisionFeedback(id, body.feedback);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('raw-invoices'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "listRawInvoices", null);
__decorate([
    (0, common_1.Get)('decision-logs'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "listDecisionLogs", null);
__decorate([
    (0, common_1.Post)('invoices/import-and-auto-register'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "importAndAutoRegister", null);
__decorate([
    (0, common_1.Post)('invoices/import-xml'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "importFromXml", null);
__decorate([
    (0, common_1.Post)('invoices/sync'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "syncFromCassetto", null);
__decorate([
    (0, common_1.Patch)('decision-logs/:id/feedback'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "setFeedback", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [invoice_automation_service_1.InvoiceAutomationService])
], AiController);
//# sourceMappingURL=ai.controller.js.map