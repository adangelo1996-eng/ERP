import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { LegalCase } from './entities/legal-case.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

@Injectable()
export class LegalService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(LegalCase)
    private readonly caseRepo: Repository<LegalCase>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async listContracts(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.contractRepo.find({
      where: { tenantId },
      order: { startDate: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async listCases(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.caseRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async createContract(input: {
    code: string;
    title: string;
    startDate: string;
    endDate?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    const contract = await this.contractRepo.save({
      ...input,
      tenantId,
    });
    await this.events.publish({
      name: 'ContractSigned',
      occurredAt: new Date(),
      tenantId,
      payload: { contractId: contract.id },
    });
    return contract;
  }

  async createLegalCase(input: { title: string }) {
    const tenantId = this.tenantContext.getTenantId();
    return this.caseRepo.save({
      tenantId,
      title: input.title,
      status: 'OPEN',
    });
  }
}

