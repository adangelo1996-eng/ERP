import { Injectable, Scope } from '@nestjs/common';

/**
 * TenantContextService mantiene il contesto del tenant corrente lungo la singola request.
 * In un secondo momento potrà essere popolato da un guard/auth filter che legge gli header JWT.
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string | null = null;

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenantId(): string {
    if (!this.tenantId) {
      // Per ora usiamo un tenant di default; in produzione sarà obbligatorio.
      return 'default';
    }
    return this.tenantId;
  }
}

