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
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const warehouse_service_1 = require("./warehouse.service");
let WarehouseController = class WarehouseController {
    warehouse;
    constructor(warehouse) {
        this.warehouse = warehouse;
    }
    listWarehouses() {
        return this.warehouse.listWarehouses();
    }
    listLocations(warehouseCode) {
        return this.warehouse.listLocations(warehouseCode);
    }
    listStock(warehouseCode, itemId) {
        return this.warehouse.listStock(warehouseCode, itemId);
    }
    listMovements(type) {
        return this.warehouse.listStockMovements(50, type);
    }
    receive(body) {
        return this.warehouse.receiveGoods(body);
    }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, common_1.Get)('warehouses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "listWarehouses", null);
__decorate([
    (0, common_1.Get)('locations'),
    __param(0, (0, common_1.Query)('warehouse')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "listLocations", null);
__decorate([
    (0, common_1.Get)('stock'),
    __param(0, (0, common_1.Query)('warehouse')),
    __param(1, (0, common_1.Query)('item')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "listStock", null);
__decorate([
    (0, common_1.Get)('movements'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "listMovements", null);
__decorate([
    (0, common_1.Post)('receipts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "receive", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, common_1.Controller)('warehouse'),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map