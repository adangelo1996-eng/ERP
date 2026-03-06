import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ledger } from '../finance/entities/ledger.entity';
import { Account } from '../finance/entities/account.entity';
import { Supplier } from '../procurement/entities/supplier.entity';
import { ProductionItem } from '../production/entities/production-item.entity';
import { WorkCenter } from '../production/entities/work-center.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Location } from '../warehouse/entities/location.entity';
import { Employee } from '../hr/entities/employee.entity';
import { User } from '../auth/entities/user.entity';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';
import * as bcrypt from 'bcrypt';

const TENANT_ID = 'default';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Ledger)
    private readonly ledgerRepo: Repository<Ledger>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(ProductionItem)
    private readonly itemRepo: Repository<ProductionItem>,
    @InjectRepository(WorkCenter)
    private readonly wcRepo: Repository<WorkCenter>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ApprovalWorkflow)
    private readonly workflowRepo: Repository<ApprovalWorkflow>,
  ) {}

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

  private async seedAuth() {
    const count = await this.userRepo.count({ where: { tenantId: TENANT_ID } });
    if (count > 0) {
      console.log('Auth data already exists, skipping');
      return;
    }
    const hash = await bcrypt.hash('admin123', 10);
    await this.userRepo.save(
      this.userRepo.create({
        tenantId: TENANT_ID,
        email: 'admin@erp.local',
        passwordHash: hash,
        fullName: 'Administrator',
        role: 'ADMIN',
      }),
    );
    console.log('Auth seeded (admin@erp.local / admin123)');
  }

  private async seedWorkflows() {
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

  private async seedFinance() {
    const existing = await this.ledgerRepo.findOne({ where: { tenantId: TENANT_ID } });
    if (existing) {
      console.log('Finance data already exists, skipping');
      return;
    }
    const ledger = await this.ledgerRepo.save(
      this.ledgerRepo.create({
        tenantId: TENANT_ID,
        name: 'Piano dei conti principale',
        currency: 'EUR',
      }),
    );
    const accounts = [
      { code: '100', name: 'Cassa', type: 'ASSET' as const },
      { code: '200', name: 'Fornitori', type: 'LIABILITY' as const },
      { code: '300', name: 'Costi', type: 'EXPENSE' as const },
      { code: '400', name: 'Ricavi', type: 'REVENUE' as const },
    ];
    for (const a of accounts) {
      await this.accountRepo.save(
        this.accountRepo.create({
          tenantId: TENANT_ID,
          ledger,
          ...a,
        }),
      );
    }
    console.log('Finance seeded');
  }

  private async seedProcurement() {
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
      await this.supplierRepo.save(
        this.supplierRepo.create({ tenantId: TENANT_ID, ...s }),
      );
    }
    console.log('Procurement seeded');
  }

  private async seedProduction() {
    const count = await this.itemRepo.count({ where: { tenantId: TENANT_ID } });
    if (count > 0) {
      console.log('Production data already exists, skipping');
      return;
    }
    const items = ['ITEM-001', 'ITEM-002', 'ITEM-003'];
    for (const itemId of items) {
      await this.itemRepo.save(
        this.itemRepo.create({ tenantId: TENANT_ID, itemId, makeToOrder: false }),
      );
    }
    const wcCount = await this.wcRepo.count({ where: { tenantId: TENANT_ID } });
    if (wcCount === 0) {
      await this.wcRepo.save(
        this.wcRepo.create({
          tenantId: TENANT_ID,
          code: 'WC01',
          name: 'Centro di lavoro principale',
          capacity: '8',
        }),
      );
    }
    console.log('Production seeded');
  }

  private async seedWarehouse() {
    const count = await this.warehouseRepo.count({ where: { tenantId: TENANT_ID } });
    if (count > 0) {
      console.log('Warehouse data already exists, skipping');
      return;
    }
    const wh = await this.warehouseRepo.save(
      this.warehouseRepo.create({
        tenantId: TENANT_ID,
        code: 'WH01',
        name: 'Magazzino principale',
      }),
    );
    const locations = ['A-01-01', 'A-01-02', 'RECEIVING'];
    for (const code of locations) {
      await this.locationRepo.save(
        this.locationRepo.create({
          tenantId: TENANT_ID,
          warehouse: wh,
          code,
        }),
      );
    }
    console.log('Warehouse seeded');
  }

  private async seedHr() {
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
      await this.employeeRepo.save(
        this.employeeRepo.create({ tenantId: TENANT_ID, ...e }),
      );
    }
    console.log('HR seeded');
  }
}
