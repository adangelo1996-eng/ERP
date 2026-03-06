declare class PurchaseOrderLineDto {
    itemId: string;
    quantity: string;
    unitPrice: string;
}
export declare class CreatePurchaseOrderDto {
    supplierId: string;
    lines: PurchaseOrderLineDto[];
}
export {};
