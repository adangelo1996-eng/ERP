import { InvestmentService } from './investment.service';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

describe('InvestmentService', () => {
  it('calcola un NPV positivo per cash flow positivo', async () => {
    const proposalRepo: any = {
      findOneByOrFail: jest.fn(async () => ({ id: 'prop1' })),
      save: jest.fn(async (x) => ({ id: 'prop1', ...x })),
    };
    const scenarioRepo: any = {
      save: jest.fn(async (x) => ({ id: 'sc1', ...x })),
    };
    const events: EventBusService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as any;
    const tenantContext: TenantContextService = {
      getTenantId: () => 'test-tenant',
      setTenantId: jest.fn(),
    } as any;

    const service = new InvestmentService(
      proposalRepo,
      scenarioRepo,
      events,
      tenantContext,
    );

    const scenario = await service.addScenario({
      proposalId: 'prop1',
      name: 'base',
      cashFlows: [1000, 1000, 1000],
      discountRate: 0.1,
    });

    expect(Number(scenario.npv)).toBeGreaterThan(0);
  });
});

