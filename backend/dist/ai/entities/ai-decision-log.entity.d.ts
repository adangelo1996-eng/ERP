import { BaseEntityWithTenant } from '../../core/database/base-entity';
export declare class AiDecisionLog extends BaseEntityWithTenant {
    context: string;
    sourceId: string;
    confidence: string;
    autoApplied: boolean;
    suggestion?: unknown;
    feedback?: 'CORRECT' | 'INCORRECT';
}
