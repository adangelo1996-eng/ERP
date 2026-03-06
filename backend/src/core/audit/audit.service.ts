import { Injectable, Logger } from '@nestjs/common';
import { TenantContextService } from '../tenant/tenant-context.service';

export interface AuditRecord {
  tenantId: string;
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger('Audit');

  constructor(private readonly tenantContext: TenantContextService) {}

  async record(record: Omit<AuditRecord, 'tenantId' | 'occurredAt'>) {
    const fullRecord: AuditRecord = {
      ...record,
      tenantId: this.tenantContext.getTenantId(),
      occurredAt: new Date(),
    };

    // Per ora logghiamo soltanto su console; in seguito scriveremo su una tabella dedicata.
    this.logger.log(JSON.stringify(fullRecord));
  }
}

