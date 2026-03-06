export interface DomainEvent<TPayload = unknown> {
    name: string;
    occurredAt: Date;
    tenantId: string;
    payload: TPayload;
}
type EventHandler<TPayload = unknown> = (event: DomainEvent<TPayload>) => Promise<void> | void;
export declare class EventBusService {
    private readonly handlers;
    subscribe<TPayload = unknown>(eventName: string, handler: EventHandler<TPayload>): void;
    publish<TPayload = unknown>(event: DomainEvent<TPayload>): Promise<void>;
}
export {};
