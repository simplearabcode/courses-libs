/**
 * Event Bus Tests
 */

import { InMemoryEventBus } from './event-bus';
import { IEvent, IEventHandler } from '../types/event.types';

// Mock event handler
class MockEventHandler<T> implements IEventHandler<T> {
  public handledEvents: IEvent<T>[] = [];

  async handle(event: IEvent<T>): Promise<void> {
    this.handledEvents.push(event);
  }
}

describe('InMemoryEventBus', () => {
  let eventBus: InMemoryEventBus;

  beforeEach(async () => {
    eventBus = new InMemoryEventBus();
    await eventBus.connect();
  });

  afterEach(async () => {
    await eventBus.disconnect();
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      const newBus = new InMemoryEventBus();
      await expect(newBus.connect()).resolves.not.toThrow();
    });
  });

  describe('disconnect', () => {
    it('should disconnect and clear handlers', async () => {
      const handler = new MockEventHandler();
      await eventBus.subscribe('test.event', handler);
      await eventBus.disconnect();

      // After disconnect, subscribing should work on reconnect
      await eventBus.connect();
      await expect(eventBus.subscribe('new.event', handler)).resolves.not.toThrow();
    });
  });

  describe('publish', () => {
    it('should publish event to subscribed handlers', async () => {
      const handler = new MockEventHandler<{ message: string }>();
      await eventBus.subscribe('user.created', handler);

      await eventBus.publish('user.created', { message: 'Hello' });

      expect(handler.handledEvents).toHaveLength(1);
      expect(handler.handledEvents[0].type).toBe('user.created');
      expect(handler.handledEvents[0].payload).toEqual({ message: 'Hello' });
    });

    it('should publish event with metadata', async () => {
      const handler = new MockEventHandler<{ userId: string }>();
      await eventBus.subscribe('user.updated', handler);

      const metadata = { source: 'api', requestId: '123' };
      await eventBus.publish('user.updated', { userId: '456' }, metadata);

      expect(handler.handledEvents).toHaveLength(1);
      expect(handler.handledEvents[0].metadata).toEqual(metadata);
    });

    it('should generate unique event IDs', async () => {
      const handler = new MockEventHandler();
      await eventBus.subscribe('test.event', handler);

      await eventBus.publish('test.event', {});
      await eventBus.publish('test.event', {});

      expect(handler.handledEvents[0].id).not.toBe(handler.handledEvents[1].id);
    });

    it('should not fail if no handlers subscribed', async () => {
      await expect(
        eventBus.publish('unsubscribed.event', { data: 'test' })
      ).resolves.not.toThrow();
    });
  });

  describe('subscribe', () => {
    it('should subscribe handler to event type', async () => {
      const handler = new MockEventHandler();
      await expect(eventBus.subscribe('test.event', handler)).resolves.not.toThrow();
    });

    it('should allow multiple handlers for same event', async () => {
      const handler1 = new MockEventHandler<{ value: number }>();
      const handler2 = new MockEventHandler<{ value: number }>();

      await eventBus.subscribe('test.event', handler1);
      await eventBus.subscribe('test.event', handler2);

      await eventBus.publish('test.event', { value: 42 });

      expect(handler1.handledEvents).toHaveLength(1);
      expect(handler2.handledEvents).toHaveLength(1);
      expect(handler1.handledEvents[0].payload.value).toBe(42);
      expect(handler2.handledEvents[0].payload.value).toBe(42);
    });

    it('should handle events in order', async () => {
      const results: number[] = [];
      const handler: IEventHandler<{ value: number }> = {
        async handle(event) {
          results.push(event.payload.value);
        },
      };

      await eventBus.subscribe('test.event', handler);

      await eventBus.publish('test.event', { value: 1 });
      await eventBus.publish('test.event', { value: 2 });
      await eventBus.publish('test.event', { value: 3 });

      expect(results).toEqual([1, 2, 3]);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from event', async () => {
      const handler = new MockEventHandler();
      await eventBus.subscribe('test.event', handler);
      await eventBus.unsubscribe('test.event');

      await eventBus.publish('test.event', { data: 'test' });

      expect(handler.handledEvents).toHaveLength(0);
    });

    it('should not throw if unsubscribing from non-existent event', async () => {
      await expect(eventBus.unsubscribe('non.existent')).resolves.not.toThrow();
    });
  });

  describe('event structure', () => {
    it('should include timestamp in events', async () => {
      const handler = new MockEventHandler();
      await eventBus.subscribe('test.event', handler);

      const beforePublish = new Date();
      await eventBus.publish('test.event', {});
      const afterPublish = new Date();

      expect(handler.handledEvents[0].timestamp).toBeInstanceOf(Date);
      expect(handler.handledEvents[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        beforePublish.getTime()
      );
      expect(handler.handledEvents[0].timestamp.getTime()).toBeLessThanOrEqual(
        afterPublish.getTime()
      );
    });

    it('should maintain event type', async () => {
      const handler = new MockEventHandler();
      await eventBus.subscribe('course.created', handler);

      await eventBus.publish('course.created', { courseId: '123' });

      expect(handler.handledEvents[0].type).toBe('course.created');
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple event types with different handlers', async () => {
      const userHandler = new MockEventHandler<{ userId: string }>();
      const courseHandler = new MockEventHandler<{ courseId: string }>();

      await eventBus.subscribe('user.created', userHandler);
      await eventBus.subscribe('course.created', courseHandler);

      await eventBus.publish('user.created', { userId: '123' });
      await eventBus.publish('course.created', { courseId: '456' });

      expect(userHandler.handledEvents).toHaveLength(1);
      expect(courseHandler.handledEvents).toHaveLength(1);
      expect(userHandler.handledEvents[0].payload.userId).toBe('123');
      expect(courseHandler.handledEvents[0].payload.courseId).toBe('456');
    });

    it('should handle rapid event publishing', async () => {
      const handler = new MockEventHandler<{ index: number }>();
      await eventBus.subscribe('test.event', handler);

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(eventBus.publish('test.event', { index: i }));
      }

      await Promise.all(promises);

      expect(handler.handledEvents).toHaveLength(100);
    });
  });
});
