import { Injectable } from '@nestjs/common';

export interface DomainEvent<TPayload = unknown> {
  name: string;
  occurredAt: Date;
  tenantId: string;
  payload: TPayload;
}

type EventHandler<TPayload = unknown> = (event: DomainEvent<TPayload>) => Promise<void> | void;

@Injectable()
export class EventBusService {
  private readonly handlers = new Map<string, EventHandler[]>();

  subscribe<TPayload = unknown>(eventName: string, handler: EventHandler<TPayload>) {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler as EventHandler);
    this.handlers.set(eventName, existing);
  }

  async publish<TPayload = unknown>(event: DomainEvent<TPayload>) {
    const handlers = this.handlers.get(event.name) ?? [];
    for (const handler of handlers) {
      // In futuro questo potrà essere asincrono su un vero message broker.
      await handler(event);
    }
  }
}

