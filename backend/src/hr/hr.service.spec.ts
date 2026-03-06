import { HrService } from './hr.service';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';

describe('HrService', () => {
  it('registra una timbratura e pubblica evento', async () => {
    const employeeRepo: any = {
      findOneByOrFail: jest.fn(async () => ({ id: 'emp1' })),
      save: jest.fn(),
    };
    const timeRepo: any = {
      save: jest.fn(async (x) => ({ id: 'te1', ...x })),
      findOneByOrFail: jest.fn(),
    };
    const leaveRepo: any = {};
    const smartRepo: any = {
      save: jest.fn(),
    };
    const events: EventBusService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as any;
    const tenantContext: TenantContextService = {
      getTenantId: () => 'test-tenant',
      setTenantId: jest.fn(),
    } as any;

    const service = new HrService(
      employeeRepo,
      timeRepo,
      leaveRepo,
      smartRepo,
      events,
      tenantContext,
    );

    await service.recordTimeEntry({
      employeeId: 'emp1',
      clockIn: new Date('2025-01-01T08:00:00Z'),
      clockOut: new Date('2025-01-01T12:00:00Z'),
    });

    expect(timeRepo.save).toHaveBeenCalled();
    expect(events.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'TimeEntryRecorded',
        payload: { timeEntryId: 'te1' },
      }),
    );
  });
});

