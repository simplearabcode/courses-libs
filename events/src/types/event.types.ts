/**
 * Base event types and interfaces
 */

export interface IEvent<T = unknown> {
  id: string;
  type: string;
  timestamp: Date;
  payload: T;
  metadata?: Record<string, unknown>;
}

export interface IEventHandler<T = unknown> {
  handle(event: IEvent<T>): Promise<void>;
}

export interface IEventPublisher {
  publish<T>(eventType: string, payload: T, metadata?: Record<string, unknown>): Promise<void>;
}

export interface IEventSubscriber {
  subscribe<T>(eventType: string, handler: IEventHandler<T>): Promise<void>;
  unsubscribe(eventType: string): Promise<void>;
}

export interface IEventBus extends IEventPublisher, IEventSubscriber {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
