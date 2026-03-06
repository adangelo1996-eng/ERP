import { SetMetadata } from '@nestjs/common';

export type AppRole =
  | 'FINANCE_MANAGER'
  | 'PRODUCTION_PLANNER'
  | 'PROCUREMENT_MANAGER'
  | 'HR_MANAGER'
  | 'LEGAL_MANAGER'
  | 'INVESTMENT_MANAGER';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

