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
export declare class AuditService {
    private readonly tenantContext;
    private readonly logger;
    constructor(tenantContext: TenantContextService);
    record(record: Omit<AuditRecord, 'tenantId' | 'occurredAt'>): Promise<void>;
}
