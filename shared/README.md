# @courses/shared

Comprehensive shared library providing types, interfaces, constants, DTOs, and utilities for the courses platform microservices architecture.

## 📦 Contents

### **Types**
- **User Types**: User, Session, Auth payload, Login result
- **Response Types**: API responses, pagination, error details
- **Course Types**: Course, Section, Lesson, Category with statuses and levels
- **Enrollment Types**: Enrollment, Progress with status tracking
- **Assessment Types**: Quiz, Question, Assignment, Submission
- **Payment Types**: Payment with provider and status management
- **Notification Types**: Notification types for platform events

### **Constants**
- **Error Codes**: 50+ standardized error codes with messages
- **Roles**: Role-based permissions system (Student, Instructor, Admin)

### **DTOs**
- **Pagination**: Pagination parameters and metadata with helpers
- **Filters**: Search, date range, price range, and custom filters

### **Utilities**
- **Logger**: Pino-based structured logging
- **Password**: Bcrypt hashing and strength validation
- **Token**: Secure token generation utilities
- **Validation**: Email, URL, slug, phone, credit card validation
- **Date**: Comprehensive date operations and formatting

### **Interfaces**
- **Base Entity**: Common entity structure with timestamps

## 🔧 Usage Examples

### Pagination

```typescript
import { PaginationParams, PaginationMeta } from '@courses/shared';

// In your controller
const params = new PaginationParams({
  page: Number(req.query.page),
  limit: Number(req.query.limit),
  sortBy: req.query.sortBy,
  sortOrder: req.query.sortOrder as 'asc' | 'desc',
});

// Use in database query
const courses = await prisma.course.findMany({
  skip: params.skip,
  take: params.take,
  orderBy: { [params.sortBy || 'createdAt']: params.sortOrder },
});

// Build response metadata
const total = await prisma.course.count();
const meta = new PaginationMeta(params.page, params.limit, total);

res.json({
  success: true,
  data: courses,
  pagination: meta,
});
```

### Validation

```typescript
import { ValidationUtil } from '@courses/shared';

// Email validation
if (!ValidationUtil.isValidEmail(email)) {
  throw new ValidationError('Invalid email address');
}

// Generate URL-friendly slugs
const slug = ValidationUtil.generateSlug('JavaScript Basics Course');
// Result: 'javascript-basics-course'

// Sanitize user input
const clean = ValidationUtil.sanitizeString(userInput);

// Validate file uploads
if (!ValidationUtil.hasValidExtension(filename, ['pdf', 'doc', 'docx'])) {
  throw new ValidationError('Invalid file type');
}
```

### Date Operations

```typescript
import { DateUtil } from '@courses/shared';

// Calculate enrollment expiry
const expiresAt = DateUtil.addDays(new Date(), 365);

// Check if content is available
if (DateUtil.isPast(course.publishedAt)) {
  // Course is published
}

// Format for display
const formatted = DateUtil.getRelativeTime(enrollment.createdAt);
// Result: "2 days ago"

// Calculate course duration
const duration = DateUtil.calculateDurationInHours(startTime, endTime);

// Format video duration
const display = DateUtil.formatDuration(3665);
// Result: "1h 1m 5s"
```

### Error Handling

```typescript
import { ErrorCodes, ErrorMessages } from '@courses/shared';

// Standardized error responses
throw new NotFoundError(ErrorMessages[ErrorCodes.COURSE_NOT_FOUND], {
  code: ErrorCodes.COURSE_NOT_FOUND,
});

// In error middleware
res.status(statusCode).json({
  success: false,
  error: {
    code: ErrorCodes.ENROLLMENT_EXPIRED,
    message: ErrorMessages[ErrorCodes.ENROLLMENT_EXPIRED],
    field: 'enrollment',
  },
});
```

### Roles & Permissions

```typescript
import { Role, hasPermission, RolePermissions } from '@courses/shared';

// Check permissions
if (!hasPermission(user.role, 'courses:create')) {
  throw new ForbiddenError('Insufficient permissions');
}

// Role validation in middleware
if (user.role !== Role.INSTRUCTOR && user.role !== Role.ADMIN) {
  throw new ForbiddenError('Instructor access required');
}

// List available permissions
const studentPermissions = RolePermissions[Role.STUDENT];
// ['courses:view', 'courses:enroll', 'lessons:view', ...]
```

### Type-Safe API Responses

```typescript
import { IApiResponse, IErrorDetails, IPaginatedResponse } from '@courses/shared';

// Success response
const response: IApiResponse<ICourse> = {
  success: true,
  message: 'Course created successfully',
  data: course,
};

// Error response
const errorResponse: IApiResponse = {
  success: false,
  error: {
    code: ErrorCodes.VALIDATION_FAILED,
    message: 'Validation failed',
    field: 'title',
    details: { min: 5, max: 100 },
  },
};

// Paginated response
const paginatedResponse: IPaginatedResponse<ICourse> = {
  success: true,
  data: courses,
  pagination: meta,
};
```

### Course Types

```typescript
import {
  CourseStatus,
  CourseLevel,
  CourseVisibility,
  EnrollmentStatus,
  ProgressStatus,
} from '@courses/shared';

// Create course with proper typing
const course: Partial<ICourse> = {
  title: 'TypeScript Masterclass',
  level: CourseLevel.INTERMEDIATE,
  status: CourseStatus.DRAFT,
  visibility: CourseVisibility.PRIVATE,
  price: 49.99,
  currency: 'USD',
};

// Track enrollment
const enrollment: IEnrollment = {
  studentId: user.id,
  courseId: course.id,
  status: EnrollmentStatus.ACTIVE,
  progress: 0,
  startedAt: new Date(),
};
```

### Logger

```typescript
import { createLogger } from '@courses/shared';

const logger = createLogger('course-service');

logger.info('Course created', { courseId, instructorId });
logger.warn('Low disk space', { available: '5%' });
logger.error('Payment failed', error, { userId, amount });
logger.debug('Processing enrollment', { enrollmentData });
```

### Password Security

```typescript
import { PasswordUtil } from '@courses/shared';

// Registration
const validation = PasswordUtil.validateStrength(password);
if (!validation.valid) {
  return res.status(400).json({
    success: false,
    errors: validation.errors,
  });
}

const hashedPassword = await PasswordUtil.hash(password);

// Login
const isValid = await PasswordUtil.compare(plainPassword, user.password);
if (!isValid) {
  throw new AuthenticationError('Invalid credentials');
}
```

### Token Generation

```typescript
import { TokenUtil } from '@courses/shared';

// Email verification
const verificationToken = TokenUtil.generateVerificationToken();
await sendVerificationEmail(user.email, verificationToken);

// Password reset
const resetToken = TokenUtil.generatePasswordResetToken();
const expiresAt = DateUtil.addHours(new Date(), 1);

// Session management
const sessionId = TokenUtil.generateSessionId();
```

## 📊 Available Enums

```typescript
// User roles
Role: STUDENT | INSTRUCTOR | ADMIN

// Course management
CourseStatus: DRAFT | PUBLISHED | ARCHIVED | UNDER_REVIEW
CourseLevel: BEGINNER | INTERMEDIATE | ADVANCED | ALL_LEVELS
CourseVisibility: PUBLIC | PRIVATE | UNLISTED
LessonType: VIDEO | TEXT | AUDIO | QUIZ | ASSIGNMENT | LIVE_SESSION | RESOURCE

// Enrollment & Progress
EnrollmentStatus: ACTIVE | COMPLETED | EXPIRED | SUSPENDED | REFUNDED
ProgressStatus: NOT_STARTED | IN_PROGRESS | COMPLETED

// Assessments
QuestionType: MULTIPLE_CHOICE | TRUE_FALSE | SHORT_ANSWER | ESSAY | FILL_BLANK
SubmissionStatus: SUBMITTED | GRADED | RETURNED | LATE

// Payments
PaymentProvider: STRIPE | PAYPAL | RAZORPAY | PADDLE
PaymentMethod: CREDIT_CARD | DEBIT_CARD | DIGITAL_WALLET | BANK_TRANSFER
PaymentStatus: PENDING | COMPLETED | FAILED | REFUNDED | CANCELLED

// Notifications
NotificationType: COURSE_ENROLLMENT | LESSON_COMPLETED | QUIZ_GRADED | ...
```

## 🧪 Testing

```bash
# Run all tests
nx test shared

# Run with coverage
nx test shared --coverage

# Watch mode
nx test shared --watch
```

**Current Coverage**: 97 tests, 100% passing

## 🏗 Building

```bash
# Build the library
nx build shared

# Build with production optimizations
nx build shared --configuration=production
```

## 📚 API Documentation

For detailed API documentation of all utilities and types, see [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md).

## 🔄 Version

Current version: 0.0.1

## 📝 Notes

- This library is meant to be used across all microservices
- Keep it lightweight and dependency-free where possible
- All utilities should be pure functions without side effects
- Types should mirror the Prisma schema where applicable
- Follow established naming conventions for consistency
