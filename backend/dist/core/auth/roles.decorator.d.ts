export type AppRole = 'FINANCE_MANAGER' | 'PRODUCTION_PLANNER' | 'PROCUREMENT_MANAGER' | 'HR_MANAGER' | 'LEGAL_MANAGER' | 'INVESTMENT_MANAGER';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
