import { ProductionService } from './production.service';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

describe('ProductionService', () => {
  it('crea un MO e pubblica evento di pianificazione', async () => {
    const moRepo: any = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ id: 'mo1', ...x })),
      findOneByOrFail: jest.fn(),
    };
    const itemRepo: any = {
      findOneByOrFail: jest.fn(async () => ({ id: 'item1' })),
    };
    const events: EventBusService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as any;
    const tenantContext: TenantContextService = {
      getTenantId: () => 'test-tenant',
      setTenantId: jest.fn(),
    } as any;

    const service = new ProductionService(
      moRepo,
      itemRepo,
      events,
      tenantContext,
    );

    const mo = await service.createManufacturingOrder({
      itemId: 'item1',
      quantity: '10',
      dueDate: '2025-01-10',
    });

    expect(moRepo.save).toHaveBeenCalled();
    expect(events.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'ManufacturingOrderPlanned',
        payload: { moId: 'mo1' },
      }),
    );
  });
});

