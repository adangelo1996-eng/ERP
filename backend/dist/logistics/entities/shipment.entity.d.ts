import { BaseEntityWithTenant } from '../../core/database/base-entity';
export type ShipmentStatus = 'PLANNED' | 'READY' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export declare class Shipment extends BaseEntityWithTenant {
    orderId: string;
    carrierId?: string;
    status: ShipmentStatus;
}
