import { BaseEntityWithTenant } from '../../core/database/base-entity';
export declare class Employee extends BaseEntityWithTenant {
    code: string;
    fullName: string;
    email: string;
}
