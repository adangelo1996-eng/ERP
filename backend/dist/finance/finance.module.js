"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finance_service_1 = require("./finance.service");
const finance_controller_1 = require("./finance.controller");
const ledger_entity_1 = require("./entities/ledger.entity");
const account_entity_1 = require("./entities/account.entity");
const journal_entry_entity_1 = require("./entities/journal-entry.entity");
const journal_line_entity_1 = require("./entities/journal-line.entity");
const customer_invoice_entity_1 = require("./entities/customer-invoice.entity");
const supplier_invoice_entity_1 = require("./entities/supplier-invoice.entity");
const payment_entity_1 = require("./entities/payment.entity");
const cost_center_entity_1 = require("./entities/cost-center.entity");
const project_entity_1 = require("./entities/project.entity");
const budget_entity_1 = require("./entities/budget.entity");
const fixed_asset_entity_1 = require("./entities/fixed-asset.entity");
const depreciation_plan_entity_1 = require("./entities/depreciation-plan.entity");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ledger_entity_1.Ledger,
                account_entity_1.Account,
                journal_entry_entity_1.JournalEntry,
                journal_line_entity_1.JournalLine,
                customer_invoice_entity_1.CustomerInvoice,
                customer_invoice_entity_1.CustomerInvoiceLine,
                supplier_invoice_entity_1.SupplierInvoice,
                supplier_invoice_entity_1.SupplierInvoiceLine,
                payment_entity_1.Payment,
                cost_center_entity_1.CostCenter,
                project_entity_1.Project,
                budget_entity_1.Budget,
                fixed_asset_entity_1.FixedAsset,
                depreciation_plan_entity_1.DepreciationPlan,
            ]),
        ],
        providers: [finance_service_1.FinanceService],
        controllers: [finance_controller_1.FinanceController],
        exports: [finance_service_1.FinanceService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map