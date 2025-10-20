/**
 * RabbitMQ Event Bus Implementation
 */

import amqp, { Channel } from 'amqplib';
import { randomUUID } from 'crypto';
import { IEvent, IEventBus, IEventHandler } from '../types/event.types';

export interface IEventBusConfig {
  url: string;
  exchange?: string;
  exchangeType?: string;
}

export class RabbitMQEventBus implements IEventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private connection: any = null;
  private channel: Channel | null = null;
  private handlers: Map<string, IEventHandler[]> = new Map();
  private config: IEventBusConfig;

  constructor(config: IEventBusConfig) {
    this.config = {
      exchange: config.exchange || 'courses_events',
      exchangeType: config.exchangeType || 'topic',
      ...config,
    };
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      const exchange = this.config.exchange || 'courses_events';
      const exchangeType = this.config.exchangeType || 'topic';

      if (this.channel) {
        await this.channel.assertExchange(
          exchange,
          exchangeType,
          { durable: true },
        );
      }

      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('✅ Disconnected from RabbitMQ');
    } catch (error) {
      console.error('❌ Error disconnecting from RabbitMQ:', error);
      throw error;
    }
  }

  async publish<T>(
    eventType: string,
    payload: T,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Event bus not connected');
    }

    const event: IEvent<T> = {
      id: randomUUID(),
      type: eventType,
      timestamp: new Date(),
      payload,
      metadata,
    };

    const routingKey = eventType.replace(/\./g, '_');
    const message = Buffer.from(JSON.stringify(event));
    const exchange = this.config.exchange || 'courses_events';

    this.channel.publish(exchange, routingKey, message, {
      persistent: true,
      contentType: 'application/json',
    });

    console.log(`📤 Published event: ${eventType}`);
  }

  async subscribe<T>(
    eventType: string,
    handler: IEventHandler<T>,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Event bus not connected');
    }

    const routingKey = eventType.replace(/\./g, '_');
    const queueName = `${eventType}_queue`;
    const exchange = this.config.exchange || 'courses_events';

    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, exchange, routingKey);

    // Store handler
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.push(handler);
    }

    // Consume messages
    const channel = this.channel;
    this.channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const event: IEvent<T> = JSON.parse(msg.content.toString());
        await handler.handle(event);
        channel.ack(msg);
        console.log(`✅ Handled event: ${eventType}`);
      } catch (error) {
        console.error(`❌ Error handling event ${eventType}:`, error);
        channel.nack(msg, false, true); // Requeue
      }
    });

    console.log(`📥 Subscribed to event: ${eventType}`);
  }

  async unsubscribe(eventType: string): Promise<void> {
    this.handlers.delete(eventType);
    console.log(`🔇 Unsubscribed from event: ${eventType}`);
  }
}

/**
 * In-Memory Event Bus for testing
 */
export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, IEventHandler[]> = new Map();

  async connect(): Promise<void> {
    console.log('✅ In-memory event bus connected');
  }

  async disconnect(): Promise<void> {
    this.handlers.clear();
    console.log('✅ In-memory event bus disconnected');
  }

  async publish<T>(
    eventType: string,
    payload: T,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: IEvent<T> = {
      id: randomUUID(),
      type: eventType,
      timestamp: new Date(),
      payload,
      metadata,
    };

    const handlers = this.handlers.get(eventType) || [];
    for (const handler of handlers) {
      await handler.handle(event);
    }
  }

  async subscribe<T>(
    eventType: string,
    handler: IEventHandler<T>,
  ): Promise<void> {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.push(handler);
    }
  }

  async unsubscribe(eventType: string): Promise<void> {
    this.handlers.delete(eventType);
  }
}
