"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const approvals_module_1 = require("../approvals/approvals.module");
const procurement_service_1 = require("./procurement.service");
const procurement_controller_1 = require("./procurement.controller");
const supplier_entity_1 = require("./entities/supplier.entity");
const purchase_request_entity_1 = require("./entities/purchase-request.entity");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
let ProcurementModule = class ProcurementModule {
};
exports.ProcurementModule = ProcurementModule;
exports.ProcurementModule = ProcurementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            approvals_module_1.ApprovalsModule,
            typeorm_1.TypeOrmModule.forFeature([
                supplier_entity_1.Supplier,
                purchase_request_entity_1.PurchaseRequest,
                purchase_order_entity_1.PurchaseOrder,
                purchase_order_entity_1.PurchaseOrderLine,
            ]),
        ],
        providers: [procurement_service_1.ProcurementService],
        controllers: [procurement_controller_1.ProcurementController],
        exports: [procurement_service_1.ProcurementService],
    })
], ProcurementModule);
//# sourceMappingURL=procurement.module.js.map