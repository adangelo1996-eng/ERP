"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seed_service_1 = require("./seed.service");
const ledger_entity_1 = require("../finance/entities/ledger.entity");
const account_entity_1 = require("../finance/entities/account.entity");
const journal_entry_entity_1 = require("../finance/entities/journal-entry.entity");
const journal_line_entity_1 = require("../finance/entities/journal-line.entity");
const supplier_entity_1 = require("../procurement/entities/supplier.entity");
const purchase_request_entity_1 = require("../procurement/entities/purchase-request.entity");
const production_item_entity_1 = require("../production/entities/production-item.entity");
const work_center_entity_1 = require("../production/entities/work-center.entity");
const manufacturing_order_entity_1 = require("../production/entities/manufacturing-order.entity");
const warehouse_entity_1 = require("../warehouse/entities/warehouse.entity");
const location_entity_1 = require("../warehouse/entities/location.entity");
const stock_entity_1 = require("../warehouse/entities/stock.entity");
const employee_entity_1 = require("../hr/entities/employee.entity");
const time_entry_entity_1 = require("../hr/entities/time-entry.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const approval_workflow_entity_1 = require("../core/entities/approval-workflow.entity");
const contract_entity_1 = require("../legal/entities/contract.entity");
const legal_case_entity_1 = require("../legal/entities/legal-case.entity");
const investment_proposal_entity_1 = require("../investment/entities/investment-proposal.entity");
const scenario_entity_1 = require("../investment/entities/scenario.entity");
const shipment_entity_1 = require("../logistics/entities/shipment.entity");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ledger_entity_1.Ledger,
                account_entity_1.Account,
                journal_entry_entity_1.JournalEntry,
                journal_line_entity_1.JournalLine,
                supplier_entity_1.Supplier,
                purchase_request_entity_1.PurchaseRequest,
                production_item_entity_1.ProductionItem,
                work_center_entity_1.WorkCenter,
                manufacturing_order_entity_1.ManufacturingOrder,
                warehouse_entity_1.Warehouse,
                location_entity_1.Location,
                stock_entity_1.StockItem,
                employee_entity_1.Employee,
                time_entry_entity_1.TimeEntry,
                user_entity_1.User,
                approval_workflow_entity_1.ApprovalWorkflow,
                contract_entity_1.Contract,
                legal_case_entity_1.LegalCase,
                investment_proposal_entity_1.InvestmentProposal,
                scenario_entity_1.InvestmentScenario,
                shipment_entity_1.Shipment,
            ]),
        ],
        providers: [seed_service_1.SeedService],
        exports: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map