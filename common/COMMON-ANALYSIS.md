# @courses/common - Analysis & Recommendations

## 📊 Current State

### ✅ What's Implemented

1. **Error Classes** (`errors/app-error.ts`)
   - ✅ AppError base class
   - ✅ ValidationError
   - ✅ AuthenticationError
   - ✅ AuthorizationError
   - ✅ NotFoundError
   - ✅ ConflictError
   - ✅ RateLimitError

2. **Middleware** 
   - ✅ Error handler (`middleware/error-handler.ts`)
   - ✅ Request logger (`middleware/request-logger.ts`)

3. **Base Validators** (`validators/base.validator.ts`)
   - ✅ emailSchema
   - ✅ passwordSchema
   - ✅ uuidSchema
   - ✅ paginationSchema
   - ✅ querySchema

### ❌ What's Missing

#### **Critical (High Priority)**

1. **Unused Scaffold Files**
   - ❌ `lib/common.ts` - Remove
   - ❌ `lib/common.spec.ts` - Remove

2. **Authentication Middleware**
   - ❌ JWT verification middleware
   - ❌ Token extraction helper
   - ❌ User context injection

3. **Authorization Middleware**
   - ❌ Role-based access control (RBAC)
   - ❌ Permission checking
   - ❌ Resource ownership validation

4. **Course-Specific Validators**
   - ❌ Course creation/update schemas
   - ❌ Enrollment validation
   - ❌ Quiz/Assignment schemas
   - ❌ Payment validation

5. **Test Coverage**
   - ❌ No tests for error classes
   - ❌ No tests for middleware
   - ❌ No tests for validators

#### **Important (Medium Priority)**

6. **Additional Middleware**
   - ❌ Rate limiting middleware
   - ❌ CORS configuration
   - ❌ Request ID middleware
   - ❌ Body size limiter

7. **Response Builders**
   - ❌ Success response helper
   - ❌ Paginated response helper
   - ❌ Error response builder

8. **Validation Helpers**
   - ❌ Custom validators (slug, phone, etc.)
   - ❌ Array validation helpers
   - ❌ Date range validators

9. **File Upload Utilities**
   - ❌ File type validation
   - ❌ File size validation
   - ❌ Multipart form handling

#### **Nice to Have (Low Priority)**

10. **Cache Utilities**
    - ❌ Cache key generator
    - ❌ Cache wrapper functions

11. **API Versioning**
    - ❌ Version extraction middleware
    - ❌ Version-based routing helpers

---

## 🎯 Recommendations

### **Phase 1: Essential Features (Do Now)**

#### 1. Remove Unused Files
```bash
rm libs/common/src/lib/common.ts
rm libs/common/src/lib/common.spec.ts
```

#### 2. Add Authentication Middleware
```typescript
// src/middleware/auth.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthenticationError } from '../errors/app-error';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = extractToken(request.headers.authorization);
    
    if (!token) {
      throw new AuthenticationError('AUTH_1007' as any, 'No token provided');
    }

    const decoded = await verifyJWT(token);
    request.user = decoded;
  } catch (error) {
    throw new AuthenticationError('AUTH_1007' as any, 'Invalid token');
  }
}

function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
}

async function verifyJWT(token: string): Promise<AuthUser> {
  // Implementation depends on your JWT library
  // This is a placeholder
  return {} as AuthUser;
}
```

#### 3. Add Authorization Middleware
```typescript
// src/middleware/authorize.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthorizationError } from '../errors/app-error';
import { Role, hasPermission } from '@courses/shared';

export function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    throw new AuthorizationError('Authentication required');
  }
}

export function requireRole(...roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new AuthorizationError('Authentication required');
    }
    
    if (!roles.includes(request.user.role as Role)) {
      throw new AuthorizationError(
        `Requires one of: ${roles.join(', ')}`
      );
    }
  };
}

export function requirePermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new AuthorizationError('Authentication required');
    }
    
    if (!hasPermission(request.user.role as Role, permission)) {
      throw new AuthorizationError(
        `Missing permission: ${permission}`
      );
    }
  };
}

export function requireOwnership(
  getResourceOwnerId: (request: FastifyRequest) => Promise<string>
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new AuthorizationError('Authentication required');
    }
    
    const ownerId = await getResourceOwnerId(request);
    
    if (request.user.userId !== ownerId && request.user.role !== Role.ADMIN) {
      throw new AuthorizationError('You can only access your own resources');
    }
  };
}
```

#### 4. Add Course Validators
```typescript
// src/validators/course.validator.ts
import { CourseLevel, CourseStatus, CourseVisibility } from '@courses/shared';

export const courseCreateSchema = {
  type: 'object',
  required: ['title', 'description', 'level', 'price', 'currency'],
  properties: {
    title: {
      type: 'string',
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 5000,
    },
    shortDescription: {
      type: 'string',
      maxLength: 200,
    },
    level: {
      type: 'string',
      enum: Object.values(CourseLevel),
    },
    price: {
      type: 'number',
      minimum: 0,
    },
    currency: {
      type: 'string',
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 10,
    },
    requirements: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 20,
    },
    objectives: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 20,
    },
  },
  additionalProperties: false,
} as const;

export const courseUpdateSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 5000,
    },
    level: {
      type: 'string',
      enum: Object.values(CourseLevel),
    },
    price: {
      type: 'number',
      minimum: 0,
    },
    status: {
      type: 'string',
      enum: Object.values(CourseStatus),
    },
    visibility: {
      type: 'string',
      enum: Object.values(CourseVisibility),
    },
  },
  additionalProperties: false,
} as const;

export const enrollmentCreateSchema = {
  type: 'object',
  required: ['courseId'],
  properties: {
    courseId: {
      type: 'string',
      format: 'uuid',
    },
  },
  additionalProperties: false,
} as const;

export const quizSubmissionSchema = {
  type: 'object',
  required: ['quizId', 'answers'],
  properties: {
    quizId: {
      type: 'string',
      format: 'uuid',
    },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        required: ['questionId', 'answer'],
        properties: {
          questionId: { type: 'string', format: 'uuid' },
          answer: {}, // Can be any type depending on question
        },
      },
    },
  },
  additionalProperties: false,
} as const;

export const assignmentSubmissionSchema = {
  type: 'object',
  required: ['assignmentId', 'content'],
  properties: {
    assignmentId: {
      type: 'string',
      format: 'uuid',
    },
    content: {
      type: 'string',
      minLength: 1,
      maxLength: 50000,
    },
  },
  additionalProperties: false,
} as const;
```

#### 5. Add Response Builders
```typescript
// src/utils/response.util.ts
import { IApiResponse, IPaginatedResponse, IPagination } from '@courses/shared';

export function successResponse<T>(
  data: T,
  message = 'Success'
): IApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function paginatedResponse<T>(
  data: T[],
  pagination: IPagination,
  message = 'Success'
): IPaginatedResponse<T> {
  return {
    success: true,
    message,
    data,
    pagination,
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>
): IApiResponse {
  return {
    success: false,
    message,
    error: {
      code,
      message,
      details,
    },
  };
}
```

---

### **Phase 2: Additional Middleware (Do Next)**

#### 6. Add Rate Limiting
```typescript
// src/middleware/rate-limit.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitError } from '../errors/app-error';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number;      // Max requests per window
  keyGenerator?: (request: FastifyRequest) => string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, max, keyGenerator } = config;

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const key = keyGenerator 
      ? keyGenerator(request) 
      : request.ip || 'unknown';

    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return;
    }

    if (record.count >= max) {
      throw new RateLimitError();
    }

    record.count++;
  };
}
```

#### 7. Add Request ID Middleware
```typescript
// src/middleware/request-id.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

export async function requestId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const id = request.headers['x-request-id'] as string || randomUUID();
  request.requestId = id;
  reply.header('x-request-id', id);
}
```

---

### **Phase 3: Testing (Critical)**

#### 8. Add Tests

**Test Structure:**
```
libs/common/src/
├── errors/
│   └── app-error.spec.ts          ❌ NEW
├── middleware/
│   ├── auth.middleware.spec.ts    ❌ NEW
│   ├── authorize.middleware.spec.ts ❌ NEW
│   ├── error-handler.spec.ts      ❌ NEW
│   └── request-logger.spec.ts     ❌ NEW
├── validators/
│   ├── base.validator.spec.ts     ❌ NEW
│   └── course.validator.spec.ts   ❌ NEW
└── utils/
    └── response.util.spec.ts      ❌ NEW
```

---

## 📝 Implementation Priority

### **Must Have (Week 1)**
1. ✅ Remove unused scaffold files
2. ✅ Add authentication middleware (JWT)
3. ✅ Add authorization middleware (RBAC)
4. ✅ Add course validators
5. ✅ Add response builders
6. ✅ Update package.json dependencies

### **Should Have (Week 2)**
7. ✅ Add rate limiting middleware
8. ✅ Add request ID middleware
9. ✅ Add comprehensive tests
10. ✅ Update README with examples

### **Nice to Have (Week 3+)**
11. ✅ Add file upload utilities
12. ✅ Add cache utilities
13. ✅ Add API versioning helpers

---

## 📦 Package.json Updates Needed

```json
{
  "dependencies": {
    "tslib": "^2.3.0",
    "@courses/shared": "*",
    "fastify": "*",
    "jsonwebtoken": "*"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "*"
  }
}
```

---

## 🎨 Recommended File Structure

```
libs/common/src/
├── errors/
│   ├── app-error.ts              ✅ EXISTS
│   └── app-error.spec.ts         ❌ ADD
├── middleware/
│   ├── auth.middleware.ts        ❌ ADD
│   ├── authorize.middleware.ts   ❌ ADD
│   ├── error-handler.ts          ✅ EXISTS
│   ├── request-logger.ts         ✅ EXISTS
│   ├── rate-limit.middleware.ts  ❌ ADD
│   ├── request-id.middleware.ts  ❌ ADD
│   └── *.spec.ts                 ❌ ADD
├── validators/
│   ├── base.validator.ts         ✅ EXISTS
│   ├── course.validator.ts       ❌ ADD
│   └── *.spec.ts                 ❌ ADD
├── utils/
│   ├── response.util.ts          ❌ ADD
│   └── response.util.spec.ts     ❌ ADD
└── index.ts                      ✅ EXISTS
```

---

## 📊 Summary

| Feature | Status | Priority | Effort |
|---------|--------|----------|--------|
| Error Classes | ✅ Done | - | - |
| Error Handler | ✅ Done | - | - |
| Request Logger | ✅ Done | - | - |
| Base Validators | ✅ Done | - | - |
| Remove Scaffolds | ❌ TODO | 🔴 High | 2 min |
| Auth Middleware | ❌ TODO | 🔴 High | 2 hours |
| RBAC Middleware | ❌ TODO | 🔴 High | 1 hour |
| Course Validators | ❌ TODO | 🔴 High | 1 hour |
| Response Builders | ❌ TODO | 🔴 High | 30 min |
| Rate Limiting | ❌ TODO | 🟡 Medium | 1 hour |
| Request ID | ❌ TODO | 🟡 Medium | 15 min |
| Tests | ❌ TODO | 🔴 High | 6 hours |

**Estimated Total Effort:** ~14 hours for all features
**Minimum Viable:** ~4-5 hours (High priority items only)

---

## ✅ Next Steps

1. **Immediate**: Remove unused scaffold files
2. **Phase 1**: Implement authentication & authorization middleware
3. **Phase 1**: Add course-specific validators
4. **Phase 1**: Add response builder utilities
5. **Phase 2**: Add rate limiting and request ID middleware
6. **Phase 3**: Create comprehensive test suite
7. **Final**: Update README with all new features
