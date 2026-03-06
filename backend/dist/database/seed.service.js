"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
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
const bcrypt = __importStar(require("bcrypt"));
const TENANT_ID = 'default';
let SeedService = class SeedService {
    ledgerRepo;
    accountRepo;
    supplierRepo;
    itemRepo;
    wcRepo;
    warehouseRepo;
    locationRepo;
    employeeRepo;
    userRepo;
    workflowRepo;
    constructor(ledgerRepo, accountRepo, supplierRepo, itemRepo, wcRepo, warehouseRepo, locationRepo, employeeRepo, userRepo, workflowRepo) {
        this.ledgerRepo = ledgerRepo;
        this.accountRepo = accountRepo;
        this.supplierRepo = supplierRepo;
        this.itemRepo = itemRepo;
        this.wcRepo = wcRepo;
        this.warehouseRepo = warehouseRepo;
        this.locationRepo = locationRepo;
        this.employeeRepo = employeeRepo;
        this.userRepo = userRepo;
        this.workflowRepo = workflowRepo;
    }
    async run() {
        await this.seedAuth();
        await this.seedWorkflows();
        await this.seedFinance();
        await this.seedProcurement();
        await this.seedProduction();
        await this.seedWarehouse();
        await this.seedHr();
        console.log('Seed completed successfully');
    }
    async seedAuth() {
        const count = await this.userRepo.count({ where: { tenantId: TENANT_ID } });
        if (count > 0) {
            console.log('Auth data already exists, skipping');
            return;
        }
        const hash = await bcrypt.hash('admin123', 10);
        await this.userRepo.save(this.userRepo.create({
            tenantId: TENANT_ID,
            email: 'admin@erp.local',
            passwordHash: hash,
            fullName: 'Administrator',
            role: 'ADMIN',
        }));
        console.log('Auth seeded (admin@erp.local / admin123)');
    }
    async seedWorkflows() {
        const count = await this.workflowRepo.count({ where: { tenantId: TENANT_ID } });
        if (count > 0) {
            console.log('Workflows already exist, skipping');
            return;
        }
        await this.workflowRepo.save([
            this.workflowRepo.create({
                tenantId: TENANT_ID,
                type: 'PR',
                thresholdAmount: '1000',
                approverRoles: 'PROCUREMENT_MANAGER',
            }),
            this.workflowRepo.create({
                tenantId: TENANT_ID,
                type: 'LEAVE',
                approverRoles: 'HR_MANAGER',
            }),
            this.workflowRepo.create({
                tenantId: TENANT_ID,
                type: 'INVESTMENT',
                thresholdAmount: '10000',
                approverRoles: 'INVESTMENT_MANAGER,FINANCE_MANAGER',
            }),
        ]);
        console.log('Workflows seeded');
    }
    async seedFinance() {
        const existing = await this.ledgerRepo.findOne({ where: { tenantId: TENANT_ID } });
        if (existing) {
            console.log('Finance data already exists, skipping');
            return;
        }
        const ledger = await this.ledgerRepo.save(this.ledgerRepo.create({
            tenantId: TENANT_ID,
            name: 'Piano dei conti principale',
            currency: 'EUR',
        }));
        const accounts = [
            { code: '100', name: 'Cassa', type: 'ASSET' },
            { code: '200', name: 'Fornitori', type: 'LIABILITY' },
            { code: '300', name: 'Costi', type: 'EXPENSE' },
            { code: '400', name: 'Ricavi', type: 'REVENUE' },
        ];
        for (const a of accounts) {
            await this.accountRepo.save(this.accountRepo.create({
                tenantId: TENANT_ID,
                ledger,
                ...a,
            }));
        }
        console.log('Finance seeded');
    }
    async seedProcurement() {
        const count = await this.supplierRepo.count({ where: { tenantId: TENANT_ID } });
        if (count > 0) {
            console.log('Procurement data already exists, skipping');
            return;
        }
        const suppliers = [
            { code: 'SUP001', name: 'Fornitore Alpha S.r.l.', countryCode: 'IT' },
            { code: 'SUP002', name: 'Fornitore Beta GmbH', countryCode: 'DE' },
            { code: 'SUP003', name: 'Fornitore Gamma SAS', countryCode: 'FR' },
        ];
        for (const s of suppliers) {
            await this.supplierRepo.save(this.supplierRepo.create({ tenantId: TENANT_ID, ...s }));
        }
        console.log('Procurement seeded');
    }
    async seedProduction() {
        const count = await this.itemRepo.count({ where: { tenantId: TENANT_ID } });
        if (count > 0) {
            console.log('Production data already exists, skipping');
            return;
        }
        const items = ['ITEM-001', 'ITEM-002', 'ITEM-003'];
        for (const itemId of items) {
            await this.itemRepo.save(this.itemRepo.create({ tenantId: TENANT_ID, itemId, makeToOrder: false }));
        }
        const wcCount = await this.wcRepo.count({ where: { tenantId: TENANT_ID } });
        if (wcCount === 0) {
            await this.wcRepo.save(this.wcRepo.create({
                tenantId: TENANT_ID,
                code: 'WC01',
                name: 'Centro di lavoro principale',
                capacity: '8',
            }));
        }
        console.log('Production seeded');
    }
    async seedWarehouse() {
        const count = await this.warehouseRepo.count({ where: { tenantId: TENANT_ID } });
        if (count > 0) {
            console.log('Warehouse data already exists, skipping');
            return;
        }
        const wh = await this.warehouseRepo.save(this.warehouseRepo.create({
            tenantId: TENANT_ID,
            code: 'WH01',
            name: 'Magazzino principale',
        }));
        const locations = ['A-01-01', 'A-01-02', 'RECEIVING'];
        for (const code of locations) {
            await this.locationRepo.save(this.locationRepo.create({
                tenantId: TENANT_ID,
                warehouse: wh,
                code,
            }));
        }
        console.log('Warehouse seeded');
    }
    async seedHr() {
        const count = await this.employeeRepo.count({ where: { tenantId: TENANT_ID } });
        if (count > 0) {
            console.log('HR data already exists, skipping');
            return;
        }
        const employees = [
            { code: 'EMP001', fullName: 'Mario Rossi', email: 'mario.rossi@example.com' },
            { code: 'EMP002', fullName: 'Laura Bianchi', email: 'laura.bianchi@example.com' },
        ];
        for (const e of employees) {
            await this.employeeRepo.save(this.employeeRepo.create({ tenantId: TENANT_ID, ...e }));
        }
        console.log('HR seeded');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entity_1.Ledger)),
    __param(1, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __param(2, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(3, (0, typeorm_1.InjectRepository)(production_item_entity_1.ProductionItem)),
    __param(4, (0, typeorm_1.InjectRepository)(work_center_entity_1.WorkCenter)),
    __param(5, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(6, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(7, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(8, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(9, (0, typeorm_1.InjectRepository)(approval_workflow_entity_1.ApprovalWorkflow)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map