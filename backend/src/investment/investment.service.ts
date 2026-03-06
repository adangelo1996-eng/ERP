import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentProposal } from './entities/investment-proposal.entity';
import { InvestmentScenario } from './entities/scenario.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentProposal)
    private readonly proposalRepo: Repository<InvestmentProposal>,
    @InjectRepository(InvestmentScenario)
    private readonly scenarioRepo: Repository<InvestmentScenario>,
    private readonly events: EventBusService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async listProposals(limit = 50) {
    const tenantId = this.tenantContext.getTenantId();
    return this.proposalRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async listScenarios(proposalId: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.scenarioRepo.find({
      where: { tenantId, proposal: { id: proposalId } },
      order: { createdAt: 'DESC' },
      relations: ['proposal'],
    });
  }

  async createProposal(input: { title: string; sponsorArea: string }) {
    const tenantId = this.tenantContext.getTenantId();
    const proposal = await this.proposalRepo.save({
      tenantId,
      title: input.title,
      sponsorArea: input.sponsorArea,
    });
    await this.events.publish({
      name: 'InvestmentProposalCreated',
      occurredAt: new Date(),
      tenantId,
      payload: { proposalId: proposal.id },
    });
    return proposal;
  }

  async addScenario(input: {
    proposalId: string;
    name: string;
    cashFlows: number[];
    discountRate: number;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    const proposal = await this.proposalRepo.findOneByOrFail({
      id: input.proposalId,
      tenantId,
    });
    const npv = this.calculateNpv(input.cashFlows, input.discountRate);
    const scenario = await this.scenarioRepo.save({
      tenantId,
      proposal,
      name: input.name,
      npv: npv.toFixed(2),
    });
    await this.events.publish({
      name: 'InvestmentScenarioCreated',
      occurredAt: new Date(),
      tenantId,
      payload: { scenarioId: scenario.id },
    });
    return scenario;
  }

  private calculateNpv(cashFlows: number[], discountRate: number): number {
    return cashFlows.reduce(
      (acc, cf, t) => acc + cf / Math.pow(1 + discountRate, t + 1),
      0,
    );
  }
}

