"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const invoice_automation_service_1 = require("./invoice-automation.service");
const invoice_parser_service_1 = require("./invoice-parser.service");
const ai_controller_1 = require("./ai.controller");
const raw_invoice_entity_1 = require("./entities/raw-invoice.entity");
const ai_decision_log_entity_1 = require("./entities/ai-decision-log.entity");
const finance_module_1 = require("../finance/finance.module");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([raw_invoice_entity_1.RawInvoice, ai_decision_log_entity_1.AiDecisionLog]),
            finance_module_1.FinanceModule,
        ],
        providers: [invoice_automation_service_1.InvoiceAutomationService, invoice_parser_service_1.InvoiceParserService],
        controllers: [ai_controller_1.AiController],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map