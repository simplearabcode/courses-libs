# @courses/database

Production-ready database utilities, Prisma client helpers, and data access patterns for microservices architecture.

## 📦 Contents

- **Transaction Utilities**: Atomic operations, retry logic, isolation levels
- **Error Handling**: Prisma error conversion to application errors
- **Health Checks**: Database connection monitoring and diagnostics
- **Lifecycle Management**: Graceful shutdown, auto-reconnect, initialization
- **Soft Delete**: Soft delete repository pattern with filters
- **Base Repository**: Abstract repository for CRUD operations

## 🔧 Usage

### Transaction Management

```typescript
import { executeInTransaction, retryTransaction } from '@courses/database';

// Execute in transaction
await executeInTransaction(prisma, async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.enrollment.create({ 
    data: { userId: user.id, courseId } 
  });
  return user;
});

// With retry on deadlock
await retryTransaction(prisma, async (tx) => {
  return await tx.payment.create({ data });
}, { maxRetries: 3, retryDelay: 100 });
```

### Error Handling

```typescript
import { handlePrismaError, isPrismaError } from '@courses/database';

try {
  await prisma.user.create({ data: { email } });
} catch (error) {
  if (isPrismaError(error)) {
    // Converts P2002 → ConflictError with proper message
    throw handlePrismaError(error);
  }
  throw error;
}
```

### Health Checks

```typescript
import { 
  checkDatabaseHealth, 
  pingDatabase,
  getDatabaseInfo 
} from '@courses/database';

// Full health check
const health = await checkDatabaseHealth(prisma);
console.log(health.status); // 'healthy' | 'unhealthy'
console.log(health.responseTime); // milliseconds
console.log(health.details); // { canConnect, canQuery, latency }

// Quick ping
const isUp = await pingDatabase(prisma);

// Get database info
const info = await getDatabaseInfo(prisma);
console.log(info.version); // PostgreSQL version
```

### Lifecycle Management

```typescript
import { 
  initializeDatabase,
  setupShutdownHandlers,
  gracefulShutdown 
} from '@courses/database';

// Initialize with retry logic
await initializeDatabase(prisma, {
  maxRetries: 5,
  retryDelay: 2000,
  onRetry: (attempt, error) => {
    console.log(`Connection attempt ${attempt} failed`);
  }
});

// Setup automatic graceful shutdown
setupShutdownHandlers(prisma);

// Or manual shutdown
process.on('SIGTERM', async () => {
  await gracefulShutdown(prisma, 'SIGTERM');
  process.exit(0);
});
```

### Soft Delete Pattern

```typescript
import { SoftDeleteRepository, excludeDeleted } from '@courses/database';

class UserRepository extends SoftDeleteRepository<User, CreateUserDTO, UpdateUserDTO> {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null }
    });
  }

  async findAllIncludingDeleted(options?: IQueryOptions): Promise<User[]> {
    return this.prisma.user.findMany({ /* ... */ });
  }

  async findByIdIncludingDeleted(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async permanentDelete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  protected async countWithFilters(filters: Record<string, unknown>): Promise<number> {
    return this.prisma.user.count({ where: filters });
  }

  // Implement other abstract methods...
}

// Usage
const repo = new UserRepository(prisma);

await repo.softDelete(userId);        // Sets deletedAt
await repo.restore(userId);            // Clears deletedAt
await repo.delete(userId);             // Soft delete (default)
await repo.permanentDelete(userId);    // Hard delete
```

### Base Repository Pattern

```typescript
import { BaseRepository } from '@courses/database';

class CourseRepository extends BaseRepository<Course, CreateCourseDTO, UpdateCourseDTO> {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async findAll(options?: IQueryOptions): Promise<Course[]> {
    const { skip, take } = this.buildPaginationQuery(options);
    const orderBy = this.buildSortQuery(options);

    return this.prisma.course.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async create(data: CreateCourseDTO): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async update(id: string, data: UpdateCourseDTO): Promise<Course> {
    return this.prisma.course.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }

  async count(filters?: Record<string, unknown>): Promise<number> {
    return this.prisma.course.count({ where: filters });
  }
}
```

## 🎯 Features

### **Transaction Management**
- ✅ Automatic rollback on errors
- ✅ Isolation level support (ReadCommitted, Serializable, etc.)
- ✅ Timeout and maxWait configuration
- ✅ Retry logic for deadlocks
- ✅ Multiple operations in single transaction

### **Error Handling**
- ✅ 15+ Prisma error codes handled
- ✅ User-friendly error messages
- ✅ Constraint field extraction
- ✅ Status code mapping
- ✅ Error type checking

### **Health & Monitoring**
- ✅ Connection health checks
- ✅ Query latency measurement
- ✅ Timeout support
- ✅ Database version info
- ✅ Connection status tracking

### **Lifecycle**
- ✅ Graceful shutdown
- ✅ Auto-retry on connection failure
- ✅ Signal handlers (SIGTERM, SIGINT)
- ✅ Unhandled error handlers
- ✅ Connection state management

### **Soft Delete**
- ✅ Soft delete by default
- ✅ Restore deleted records
- ✅ Query with/without deleted
- ✅ Permanent delete option
- ✅ Helper filter functions

## 📊 Error Code Mappings

| Prisma Code | Error Type | HTTP Status | Description |
|-------------|------------|-------------|-------------|
| P2002 | ConflictError | 409 | Unique constraint violation |
| P2025 | NotFoundError | 404 | Record not found |
| P2003 | ValidationError | 400 | Foreign key violation |
| P2000 | ValidationError | 400 | Value too long |
| P2011 | ValidationError | 400 | Null constraint violation |
| P1001-P1008 | DatabaseError | 503 | Connection failed |
| P2034 | ConflictError | 409 | Transaction conflict |
| P2024 | DatabaseError | 408 | Query timeout |

## 🏗 Architecture

```
┌─────────────────────────────────────┐
│        Service Layer                │
│    (Business Logic)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Repository Layer                │
│  Uses @courses/database utilities   │
│  - Transaction management           │
│  - Error handling                   │
│  - Soft delete support             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Prisma Client                   │
│  (Service-specific generated)       │
└─────────────────────────────────────┘
```

## 🎨 Design Philosophy

### **Generic & Reusable**
- Uses generic types to work with any Prisma client
- Each service has its own generated Prisma client
- No tight coupling to specific schemas

### **Type-Safe at Service Level**
- Services provide their own type definitions
- Generic utilities accept any Prisma client
- Type safety enforced where it matters

### **Workspace-Optimized**
- Dependencies use `"*"` for workspace versions
- No package duplication
- Consistent versioning across services

## 🧪 Testing

```bash
# Run tests
nx test database

# Run with coverage
nx test database --coverage
```

## 🏗 Building

```bash
# Build the library
nx build database

# Build with production optimizations
nx build database --configuration=production
```

## 📚 Documentation

- [DATABASE-ANALYSIS.md](./DATABASE-ANALYSIS.md) - Gap analysis and recommendations
- [DATABASE-IMPLEMENTATION-SUMMARY.md](./DATABASE-IMPLEMENTATION-SUMMARY.md) - Implementation details

## 🔄 Version

Current version: 0.0.1

## 📝 Notes

- **Generic `any` types**: Intentional for maximum flexibility across services
- **No @prisma/client dependency**: Each service provides its own
- **Workspace dependencies**: Uses `"*"` to reference workspace versions
- **Soft delete**: Override `delete()` to use soft delete by default
