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
exports.LogisticsController = void 0;
const common_1 = require("@nestjs/common");
const logistics_service_1 = require("./logistics.service");
let LogisticsController = class LogisticsController {
    logistics;
    constructor(logistics) {
        this.logistics = logistics;
    }
    listShipments() {
        return this.logistics.listShipments();
    }
    createShipment(body) {
        return this.logistics.createShipment(body);
    }
};
exports.LogisticsController = LogisticsController;
__decorate([
    (0, common_1.Get)('shipments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "listShipments", null);
__decorate([
    (0, common_1.Post)('shipments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "createShipment", null);
exports.LogisticsController = LogisticsController = __decorate([
    (0, common_1.Controller)('logistics'),
    __metadata("design:paramtypes", [logistics_service_1.LogisticsService])
], LogisticsController);
//# sourceMappingURL=logistics.controller.js.map