import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ledger } from '../finance/entities/ledger.entity';
import { Account } from '../finance/entities/account.entity';
import { JournalEntry } from '../finance/entities/journal-entry.entity';
import { JournalLine } from '../finance/entities/journal-line.entity';
import { Supplier } from '../procurement/entities/supplier.entity';
import { PurchaseRequest } from '../procurement/entities/purchase-request.entity';
import { ProductionItem } from '../production/entities/production-item.entity';
import { WorkCenter } from '../production/entities/work-center.entity';
import { ManufacturingOrder } from '../production/entities/manufacturing-order.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Location } from '../warehouse/entities/location.entity';
import { StockItem } from '../warehouse/entities/stock.entity';
import { Employee } from '../hr/entities/employee.entity';
import { TimeEntry } from '../hr/entities/time-entry.entity';
import { User } from '../auth/entities/user.entity';
import { ApprovalWorkflow } from '../core/entities/approval-workflow.entity';
import { Contract } from '../legal/entities/contract.entity';
import { LegalCase } from '../legal/entities/legal-case.entity';
import { InvestmentProposal } from '../investment/entities/investment-proposal.entity';
import { InvestmentScenario } from '../investment/entities/scenario.entity';
import { Shipment } from '../logistics/entities/shipment.entity';
import * as bcrypt from 'bcrypt';

const TENANT_ID = 'default';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Ledger)
    private readonly ledgerRepo: Repository<Ledger>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(JournalEntry)
    private readonly journalRepo: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly journalLineRepo: Repository<JournalLine>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    @InjectRepository(ProductionItem)
    private readonly itemRepo: Repository<ProductionItem>,
    @InjectRepository(WorkCenter)
    private readonly wcRepo: Repository<WorkCenter>,
    @InjectRepository(ManufacturingOrder)
    private readonly moRepo: Repository<ManufacturingOrder>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
    @InjectRepository(StockItem)
    private readonly stockRepo: Repository<StockItem>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepo: Repository<TimeEntry>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ApprovalWorkflow)
    private readonly workflowRepo: Repository<ApprovalWorkflow>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(LegalCase)
    private readonly legalCaseRepo: Repository<LegalCase>,
    @InjectRepository(InvestmentProposal)
    private readonly invProposalRepo: Repository<InvestmentProposal>,
    @InjectRepository(InvestmentScenario)
    private readonly invScenarioRepo: Repository<InvestmentScenario>,
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
  ) {}

  async run() {
    await this.seedAuth();
    await this.seedWorkflows();
    await this.seedFinance();
    await this.seedProcurement();
    await this.seedProduction();
    await this.seedWarehouse();
    await this.seedHr();
    await this.seedDemoData();
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

  private async seedDemoData() {
    const hasData = await this.journalRepo.count({ where: { tenantId: TENANT_ID } });
    if (hasData > 0) {
      console.log('Demo data already exists, skipping');
      return;
    }

    const ledger = await this.ledgerRepo.findOne({ where: { tenantId: TENANT_ID } });
    const accounts = await this.accountRepo.find({
      where: { tenantId: TENANT_ID },
      order: { code: 'ASC' },
    });
    const employees = await this.employeeRepo.find({ where: { tenantId: TENANT_ID } });
    const items = await this.itemRepo.find({ where: { tenantId: TENANT_ID } });
    const locations = await this.locationRepo.find({
      where: { tenantId: TENANT_ID },
      relations: ['warehouse'],
      take: 3,
    });

    if (ledger && accounts.length >= 2) {
      const entry1 = await this.journalRepo.save(
        this.journalRepo.create({
          tenantId: TENANT_ID,
          ledger,
          postingDate: '2025-03-01',
          reference: 'Apertura cassa',
          source: 'MANUAL',
          posted: true,
        }),
      );
      await this.journalLineRepo.save([
        this.journalLineRepo.create({
          tenantId: TENANT_ID,
          entry: entry1,
          account: accounts[0],
          debit: '10000',
          credit: '0',
          description: 'Versamento iniziale',
        }),
        this.journalLineRepo.create({
          tenantId: TENANT_ID,
          entry: entry1,
          account: accounts[3],
          debit: '0',
          credit: '10000',
          description: 'Capitale iniziale',
        }),
      ]);
      const entry2 = await this.journalRepo.save(
        this.journalRepo.create({
          tenantId: TENANT_ID,
          ledger,
          postingDate: '2025-03-05',
          reference: 'Fattura acquisto SUP001',
          source: 'PURCHASES',
          posted: true,
        }),
      );
      await this.journalLineRepo.save([
        this.journalLineRepo.create({
          tenantId: TENANT_ID,
          entry: entry2,
          account: accounts[2],
          debit: '1200',
          credit: '0',
          description: 'Acquisto materiali',
        }),
        this.journalLineRepo.create({
          tenantId: TENANT_ID,
          entry: entry2,
          account: accounts[1],
          debit: '0',
          credit: '1200',
          description: 'Fornitore Alpha',
        }),
      ]);
    }

    if (employees.length > 0 && items.length > 0) {
      await this.prRepo.save([
        this.prRepo.create({
          tenantId: TENANT_ID,
          requesterId: employees[0].id,
          itemId: items[0].itemId,
          quantity: '50',
          estimatedValue: '500',
          status: 'APPROVED',
        }),
        this.prRepo.create({
          tenantId: TENANT_ID,
          requesterId: employees[1].id,
          itemId: items[1].itemId,
          quantity: '20',
          estimatedValue: '200',
          status: 'SUBMITTED',
        }),
      ]);
    }

    if (items.length > 0) {
      await this.moRepo.save([
        this.moRepo.create({
          tenantId: TENANT_ID,
          item: items[0],
          quantity: '100',
          dueDate: '2025-03-20',
          status: 'RELEASED',
        }),
        this.moRepo.create({
          tenantId: TENANT_ID,
          item: items[1],
          quantity: '50',
          dueDate: '2025-03-25',
          status: 'PLANNED',
        }),
      ]);
    }

    if (locations.length > 0) {
      const loc = locations[0];
      await this.stockRepo.save([
        this.stockRepo.create({
          tenantId: TENANT_ID,
          location: loc,
          itemId: 'ITEM-001',
          quantity: '150',
          batch: 'LOT001',
        }),
        this.stockRepo.create({
          tenantId: TENANT_ID,
          location: loc,
          itemId: 'ITEM-002',
          quantity: '80',
        }),
      ]);
    }

    if (employees.length > 0) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      await this.timeEntryRepo.save([
        this.timeEntryRepo.create({
          tenantId: TENANT_ID,
          employee: employees[0],
          clockIn: yesterday,
          clockOut: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000),
          status: 'APPROVED',
        }),
        this.timeEntryRepo.create({
          tenantId: TENANT_ID,
          employee: employees[1],
          clockIn: today,
          status: 'RECORDED',
        }),
      ]);
    }

    await this.contractRepo.save([
      this.contractRepo.create({
        tenantId: TENANT_ID,
        code: 'CNT-001',
        title: 'Contratto fornitura annuale Alpha',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      }),
      this.contractRepo.create({
        tenantId: TENANT_ID,
        code: 'CNT-002',
        title: 'NDA con partner tecnologico',
        startDate: '2025-02-15',
      }),
    ]);

    await this.legalCaseRepo.save(
      this.legalCaseRepo.create({
        tenantId: TENANT_ID,
        title: 'Contenzioso ritardo consegna - Fornitore Beta',
        status: 'OPEN',
      }),
    );

    const prop = await this.invProposalRepo.save(
      this.invProposalRepo.create({
        tenantId: TENANT_ID,
        title: 'Ampliamento linea produzione',
        sponsorArea: 'PRODUCTION',
      }),
    );
    await this.invScenarioRepo.save(
      this.invScenarioRepo.create({
        tenantId: TENANT_ID,
        proposal: prop,
        name: 'Base',
        npv: '125000',
      }),
    );

    await this.shipmentRepo.save([
      this.shipmentRepo.create({
        tenantId: TENANT_ID,
        orderId: 'ORD-2025-001',
        status: 'IN_TRANSIT',
      }),
      this.shipmentRepo.create({
        tenantId: TENANT_ID,
        orderId: 'ORD-2025-002',
        status: 'DELIVERED',
      }),
    ]);

    console.log('Demo data seeded');
  }
}
