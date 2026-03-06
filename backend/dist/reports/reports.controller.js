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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const roles_decorator_1 = require("../core/auth/roles.decorator");
let ReportsController = class ReportsController {
    reports;
    constructor(reports) {
        this.reports = reports;
    }
    trialBalance(from, to) {
        return this.reports.trialBalance(from, to);
    }
    budgetByCostCenter(year) {
        const y = year ? Number(year) : new Date().getFullYear();
        return this.reports.budgetByCostCenter(y);
    }
    budgetByProject(year) {
        const y = year ? Number(year) : new Date().getFullYear();
        return this.reports.budgetByProject(y);
    }
    agingCustomers() {
        return this.reports.agingCustomers();
    }
    agingSuppliers() {
        return this.reports.agingSuppliers();
    }
    workingHours() {
        return this.reports.workingHoursByEmployee();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('finance/trial-balance'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "trialBalance", null);
__decorate([
    (0, common_1.Get)('finance/budget-by-cost-center'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "budgetByCostCenter", null);
__decorate([
    (0, common_1.Get)('finance/budget-by-project'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "budgetByProject", null);
__decorate([
    (0, common_1.Get)('finance/aging-customers'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "agingCustomers", null);
__decorate([
    (0, common_1.Get)('finance/aging-suppliers'),
    (0, roles_decorator_1.Roles)('FINANCE_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "agingSuppliers", null);
__decorate([
    (0, common_1.Get)('hr/working-hours'),
    (0, roles_decorator_1.Roles)('HR_MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "workingHours", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map