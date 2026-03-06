"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_module_1 = require("./core/core.module");
const finance_module_1 = require("./finance/finance.module");
const production_module_1 = require("./production/production.module");
const procurement_module_1 = require("./procurement/procurement.module");
const warehouse_module_1 = require("./warehouse/warehouse.module");
const logistics_module_1 = require("./logistics/logistics.module");
const hr_module_1 = require("./hr/hr.module");
const legal_module_1 = require("./legal/legal.module");
const investment_module_1 = require("./investment/investment.module");
const reports_module_1 = require("./reports/reports.module");
const ai_module_1 = require("./ai/ai.module");
const seed_module_1 = require("./database/seed.module");
const auth_module_1 = require("./auth/auth.module");
const approvals_module_1 = require("./approvals/approvals.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const useSqlite = process.env.USE_SQLITE === 'true' || process.env.DB_TYPE === 'sqlite';
                    if (useSqlite) {
                        return {
                            type: 'better-sqlite3',
                            database: process.env.SQLITE_PATH || 'erp.sqlite',
                            autoLoadEntities: true,
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: process.env.DB_HOST || 'localhost',
                        port: Number(process.env.DB_PORT) || 5432,
                        username: process.env.DB_USER || 'erp',
                        password: process.env.DB_PASSWORD || 'erp',
                        database: process.env.DB_NAME || 'erp',
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
            core_module_1.CoreModule,
            finance_module_1.FinanceModule,
            production_module_1.ProductionModule,
            procurement_module_1.ProcurementModule,
            warehouse_module_1.WarehouseModule,
            logistics_module_1.LogisticsModule,
            hr_module_1.HrModule,
            legal_module_1.LegalModule,
            investment_module_1.InvestmentModule,
            reports_module_1.ReportsModule,
            ai_module_1.AiModule,
            seed_module_1.SeedModule,
            auth_module_1.AuthModule,
            approvals_module_1.ApprovalsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map