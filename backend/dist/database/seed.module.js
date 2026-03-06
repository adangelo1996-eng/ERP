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
const supplier_entity_1 = require("../procurement/entities/supplier.entity");
const production_item_entity_1 = require("../production/entities/production-item.entity");
const work_center_entity_1 = require("../production/entities/work-center.entity");
const warehouse_entity_1 = require("../warehouse/entities/warehouse.entity");
const location_entity_1 = require("../warehouse/entities/location.entity");
const employee_entity_1 = require("../hr/entities/employee.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const approval_workflow_entity_1 = require("../core/entities/approval-workflow.entity");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ledger_entity_1.Ledger,
                account_entity_1.Account,
                supplier_entity_1.Supplier,
                production_item_entity_1.ProductionItem,
                work_center_entity_1.WorkCenter,
                warehouse_entity_1.Warehouse,
                location_entity_1.Location,
                employee_entity_1.Employee,
                user_entity_1.User,
                approval_workflow_entity_1.ApprovalWorkflow,
            ]),
        ],
        providers: [seed_service_1.SeedService],
        exports: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map