"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reports_service_1 = require("./reports.service");
const reports_controller_1 = require("./reports.controller");
const journal_line_entity_1 = require("../finance/entities/journal-line.entity");
const account_entity_1 = require("../finance/entities/account.entity");
const time_entry_entity_1 = require("../hr/entities/time-entry.entity");
const employee_entity_1 = require("../hr/entities/employee.entity");
const budget_entity_1 = require("../finance/entities/budget.entity");
const cost_center_entity_1 = require("../finance/entities/cost-center.entity");
const project_entity_1 = require("../finance/entities/project.entity");
const customer_invoice_entity_1 = require("../finance/entities/customer-invoice.entity");
const supplier_invoice_entity_1 = require("../finance/entities/supplier-invoice.entity");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                journal_line_entity_1.JournalLine,
                account_entity_1.Account,
                time_entry_entity_1.TimeEntry,
                employee_entity_1.Employee,
                budget_entity_1.Budget,
                cost_center_entity_1.CostCenter,
                project_entity_1.Project,
                customer_invoice_entity_1.CustomerInvoice,
                supplier_invoice_entity_1.SupplierInvoice,
            ]),
        ],
        providers: [reports_service_1.ReportsService],
        controllers: [reports_controller_1.ReportsController],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map