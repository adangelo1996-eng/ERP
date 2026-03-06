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
exports.ProcurementController = void 0;
const common_1 = require("@nestjs/common");
const procurement_service_1 = require("./procurement.service");
const roles_decorator_1 = require("../core/auth/roles.decorator");
const create_purchase_order_dto_1 = require("./dto/create-purchase-order.dto");
let ProcurementController = class ProcurementController {
    procurement;
    constructor(procurement) {
        this.procurement = procurement;
    }
    listPurchaseRequests() {
        return this.procurement.listPurchaseRequests();
    }
    listPurchaseOrders() {
        return this.procurement.listPurchaseOrders();
    }
    listSuppliers() {
        return this.procurement.listSuppliers();
    }
    createPR(body) {
        return this.procurement.createPurchaseRequest(body);
    }
    approve(id) {
        return this.procurement.approvePurchaseRequest(id);
    }
    createPO(body) {
        return this.procurement.createPurchaseOrder(body);
    }
};
exports.ProcurementController = ProcurementController;
__decorate([
    (0, common_1.Get)('purchase-requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "listPurchaseRequests", null);
__decorate([
    (0, common_1.Get)('purchase-orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "listPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('suppliers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "listSuppliers", null);
__decorate([
    (0, common_1.Post)('purchase-requests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createPR", null);
__decorate([
    (0, common_1.Patch)('purchase-requests/:id/approve'),
    (0, roles_decorator_1.Roles)('PROCUREMENT_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('purchase-orders'),
    (0, roles_decorator_1.Roles)('PROCUREMENT_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_order_dto_1.CreatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createPO", null);
exports.ProcurementController = ProcurementController = __decorate([
    (0, common_1.Controller)('procurement'),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService])
], ProcurementController);
//# sourceMappingURL=procurement.controller.js.map