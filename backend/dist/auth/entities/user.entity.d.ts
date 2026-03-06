import { BaseEntityWithTenant } from '../../core/database/base-entity';
export declare class User extends BaseEntityWithTenant {
    email: string;
    passwordHash: string;
    fullName: string;
    role: string;
}
