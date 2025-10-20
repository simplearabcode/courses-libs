# @courses/events

Comprehensive event bus implementation and event-driven communication utilities for the courses platform microservices architecture.

## 📦 Contents

- **Event Bus**: RabbitMQ implementation with fallback in-memory bus for testing
- **Event Catalog**: 70+ standardized event types with typed payloads
- **Event Handlers**: Base interfaces for event handling
- **Event Types**: Organized by domain (User, Course, Enrollment, Assessment, Payment, Certificate, Notification)

## 🎯 Event Categories

### **User Events** (11 events)
- Registration, login/logout, email verification
- Password changes and resets
- Profile updates, role changes
- Account activation/deactivation

### **Course Events** (16 events)
- Course lifecycle (created, updated, published, archived, deleted)
- Section management (created, updated, deleted, reordered)
- Lesson management (created, updated, published, completed, viewed)

### **Enrollment Events** (10 events)
- Enrollment lifecycle (created, completed, expired, suspended, refunded)
- Progress tracking (updated, milestones)
- Course started/completed

### **Assessment Events** (17 events)
- Quiz lifecycle (created, updated, published, deleted)
- Quiz attempts (started, submitted, graded, passed, failed)
- Assignment lifecycle (created, updated, published, deleted)
- Assignment submissions (submitted, graded, resubmitted)

### **Payment Events** (10 events)
- Payment processing (initiated, processing, completed, failed, cancelled)
- Refund processing (initiated, processing, completed, failed)
- Webhook handling

### **Certificate Events** (7 events)
- Certificate generation and issuance
- Certificate viewing, downloading, sharing
- Certificate verification and revocation

### **Notification Events** (17 events)
- Course and lesson notifications
- Progress and completion notifications
- Assessment grading notifications
- Payment and refund notifications
- Discussion and mention notifications

## 🔧 Usage Examples

### Publishing Events

```typescript
import { 
  RabbitMQEventBus, 
  CourseEventTypes, 
  ICourseCreatedPayload 
} from '@courses/events';

// Initialize event bus
const eventBus = new RabbitMQEventBus({
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  exchange: 'courses_events',
});

await eventBus.connect();

// Publish course created event
await eventBus.publish<ICourseCreatedPayload>(
  CourseEventTypes.COURSE_CREATED,
  {
    courseId: course.id,
    instructorId: course.instructorId,
    title: course.title,
    level: course.level,
    price: course.price,
    currency: course.currency,
    timestamp: new Date(),
  }
);

// Publish enrollment event
await eventBus.publish(
  EnrollmentEventTypes.ENROLLMENT_CREATED,
  {
    enrollmentId: enrollment.id,
    studentId: student.id,
    courseId: course.id,
    courseTitle: course.title,
    instructorId: course.instructorId,
    price: course.price,
    currency: course.currency,
    startedAt: new Date(),
    timestamp: new Date(),
  }
);
```

### Subscribing to Events

```typescript
import { 
  IEventHandler, 
  IEvent, 
  UserEventTypes,
  IUserRegisteredPayload 
} from '@courses/events';

// Create event handler
class WelcomeEmailHandler implements IEventHandler<IUserRegisteredPayload> {
  async handle(event: IEvent<IUserRegisteredPayload>): Promise<void> {
    const { userId, email, role } = event.payload;
    
    await emailService.sendWelcomeEmail({
      to: email,
      userId,
      role,
    });
    
    console.log(`Welcome email sent to ${email}`);
  }
}

// Subscribe to event
const handler = new WelcomeEmailHandler();
await eventBus.subscribe(
  UserEventTypes.USER_REGISTERED,
  handler
);
```

### Multiple Subscribers

```typescript
// Analytics tracking
class AnalyticsHandler implements IEventHandler {
  async handle(event: IEvent): Promise<void> {
    await analytics.track(event.type, event.payload);
  }
}

// Notification service
class NotificationHandler implements IEventHandler {
  async handle(event: IEvent): Promise<void> {
    await notificationService.send(event.payload);
  }
}

// Both handlers will receive the event
await eventBus.subscribe(CourseEventTypes.COURSE_PUBLISHED, new AnalyticsHandler());
await eventBus.subscribe(CourseEventTypes.COURSE_PUBLISHED, new NotificationHandler());
```

### Using In-Memory Bus (Testing)

```typescript
import { InMemoryEventBus } from '@courses/events';

// Perfect for unit tests
const eventBus = new InMemoryEventBus();
await eventBus.connect();

// Events are processed synchronously in-memory
await eventBus.publish('test.event', { data: 'test' });
```

## 📊 Event Flow Examples

### Course Creation Flow

```typescript
// 1. Course created
await eventBus.publish(CourseEventTypes.COURSE_CREATED, {
  courseId, instructorId, title, level, price, currency, timestamp
});
↓
// 2. Section added
await eventBus.publish(CourseEventTypes.SECTION_CREATED, {
  sectionId, courseId, title, position, timestamp
});
↓
// 3. Lesson added
await eventBus.publish(CourseEventTypes.LESSON_CREATED, {
  lessonId, sectionId, courseId, title, type, position, timestamp
});
↓
// 4. Course published
await eventBus.publish(CourseEventTypes.COURSE_PUBLISHED, {
  courseId, instructorId, title, publishedAt, timestamp
});
```

### Enrollment & Progress Flow

```typescript
// 1. Payment completed
await eventBus.publish(PaymentEventTypes.PAYMENT_COMPLETED, {
  paymentId, studentId, courseId, amount, provider, timestamp
});
↓
// 2. Enrollment created
await eventBus.publish(EnrollmentEventTypes.ENROLLMENT_CREATED, {
  enrollmentId, studentId, courseId, courseTitle, timestamp
});
↓
// 3. Course started
await eventBus.publish(EnrollmentEventTypes.COURSE_STARTED, {
  studentId, courseId, courseTitle, instructorId, timestamp
});
↓
// 4. Lesson completed
await eventBus.publish(CourseEventTypes.LESSON_COMPLETED, {
  lessonId, courseId, studentId, completionRate, timestamp
});
↓
// 5. Progress milestone
await eventBus.publish(EnrollmentEventTypes.PROGRESS_MILESTONE, {
  studentId, courseId, milestone: 50, completedLessons, totalLessons, timestamp
});
↓
// 6. Course completed
await eventBus.publish(EnrollmentEventTypes.COURSE_COMPLETED, {
  studentId, courseId, courseTitle, completedAt, certificateEligible, timestamp
});
↓
// 7. Certificate issued
await eventBus.publish(CertificateEventTypes.CERTIFICATE_ISSUED, {
  certificateId, studentId, courseId, certificateNumber, timestamp
});
```

### Assessment Flow

```typescript
// 1. Quiz started
await eventBus.publish(AssessmentEventTypes.QUIZ_STARTED, {
  attemptId, quizId, studentId, courseId, attemptNumber, startedAt, timestamp
});
↓
// 2. Quiz submitted
await eventBus.publish(AssessmentEventTypes.QUIZ_SUBMITTED, {
  attemptId, quizId, studentId, courseId, timeSpent, timestamp
});
↓
// 3. Quiz graded (automatic)
await eventBus.publish(AssessmentEventTypes.QUIZ_GRADED, {
  attemptId, quizId, studentId, score, percentage, passed, timestamp
});
↓
// 4. Notification sent
await eventBus.publish(NotificationEventTypes.NOTIFICATION_QUIZ_GRADED, {
  userId: studentId, quizId, score, passed, timestamp
});
```

## 🏗 Event Bus Configuration

### Production (RabbitMQ)

```typescript
const eventBus = new RabbitMQEventBus({
  url: process.env.RABBITMQ_URL,
  exchange: 'courses_events',
  exchangeType: 'topic',
});
```

### Development/Testing (In-Memory)

```typescript
const eventBus = new InMemoryEventBus();
```

### Environment Variables

```env
RABBITMQ_URL=amqp://user:password@localhost:5672
RABBITMQ_EXCHANGE=courses_events
```

## 🎯 Best Practices

1. **Always use typed payloads** - Import and use the predefined payload interfaces
2. **Include timestamps** - Every event payload should have a timestamp
3. **Keep payloads minimal** - Only include necessary data; services can fetch additional details
4. **Use past tense** - Event names should describe what happened (e.g., `COURSE_CREATED`, not `CREATE_COURSE`)
5. **Handle failures gracefully** - Implement retry logic and dead-letter queues
6. **Test with InMemoryEventBus** - Use the in-memory implementation for unit tests
7. **Document side effects** - Clearly document what happens when an event is published

## 📝 Event Payload Patterns

All event payloads follow consistent patterns:

```typescript
interface IEventPayload {
  // Primary identifiers
  [entity]Id: string;
  
  // Related entities
  userId?: string;
  courseId?: string;
  
  // Event-specific data
  [eventData]: unknown;
  
  // Required timestamp
  timestamp: Date;
}
```

## 🧪 Testing

```bash
# Run all tests
nx test events

# Run with coverage
nx test events --coverage
```

## 🏗 Building

```bash
# Build the library
nx build events

# Build with production optimizations
nx build events --configuration=production
```

## 📚 Complete Event Catalog

See [SHARED-LIBRARIES-ANALYSIS.md](../SHARED-LIBRARIES-ANALYSIS.md) for the complete list of all 70+ event types.

## 🔄 Version

Current version: 0.0.1
