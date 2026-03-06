import { LegalService } from './legal.service';
export declare class LegalController {
    private readonly legal;
    constructor(legal: LegalService);
    listContracts(): Promise<import("./entities/contract.entity").Contract[]>;
    listCases(): Promise<import("./entities/legal-case.entity").LegalCase[]>;
    createContract(body: {
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
    } & import("./entities/contract.entity").Contract>;
    createCase(body: {
        title: string;
    }): Promise<{
        tenantId: string;
        title: string;
        status: string;
    } & import("./entities/legal-case.entity").LegalCase>;
}
