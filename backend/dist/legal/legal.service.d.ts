import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { LegalCase } from './entities/legal-case.entity';
import { EventBusService } from '../core/events/event-bus.service';
import { TenantContextService } from '../core/tenant/tenant-context.service';
export declare class LegalService {
    private readonly contractRepo;
    private readonly caseRepo;
    private readonly events;
    private readonly tenantContext;
    constructor(contractRepo: Repository<Contract>, caseRepo: Repository<LegalCase>, events: EventBusService, tenantContext: TenantContextService);
    listContracts(limit?: number): Promise<Contract[]>;
    listCases(limit?: number): Promise<LegalCase[]>;
    createContract(input: {
        code: string;
        title: string;
        startDate: string;
        endDate?: string;
    }): Promise<{
        tenantId: string;
        code: string;
        title: string;
        startDate: string;
        endDate?: string;
    } & Contract>;
    createLegalCase(input: {
        title: string;
    }): Promise<{
        tenantId: string;
        title: string;
        status: string;
    } & LegalCase>;
}
