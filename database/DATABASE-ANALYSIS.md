# @courses/database - Analysis & Recommendations

## 📊 Current State

### ✅ What's Implemented

1. **Base Repository Pattern** (`repositories/base.repository.ts`)
   - Abstract base class for CRUD operations
   - Pagination helper methods
   - Sort query builder
   - Good foundation but abstract only

2. **Prisma Client Factory** (`prisma/client.ts`)
   - Factory function for creating Prisma clients
   - Client manager for multiple database connections
   - Logging configuration

### ❌ What's Missing

#### **Critical (High Priority)**

1. **Unused Scaffold Files**
   - `lib/database.ts` - Remove
   - `lib/database.spec.ts` - Remove

2. **Transaction Utilities**
   - No transaction wrapper
   - No rollback handling
   - No transaction isolation support

3. **Connection Management**
   - No connection health checks
   - No connection pooling configuration
   - No graceful shutdown handling

4. **Error Handling**
   - No Prisma-specific error handling
   - No constraint violation handling
   - No connection error handling

5. **Tests**
   - No tests for base repository
   - No tests for client factory
   - No integration tests

#### **Important (Medium Priority)**

6. **Soft Delete Support**
   - No soft delete mixin
   - No deleted_at field handling

7. **Query Helpers**
   - No search/filter builders
   - No relation loading helpers
   - No bulk operations

8. **Migration Utilities**
   - No migration helpers
   - No seeding utilities

9. **Audit Trail**
   - No created_by/updated_by tracking
   - No change history

10. **Type Safety**
    - Generic `any` types for Prisma client
    - Could use better typing

---

## 🎯 Recommendations

### **Phase 1: Essential Improvements (Do Now)**

#### 1. Remove Unused Files
```bash
rm libs/database/src/lib/database.ts
rm libs/database/src/lib/database.spec.ts
```

#### 2. Add Transaction Support
```typescript
// src/utils/transaction.util.ts
export async function executeInTransaction<T>(
  prisma: PrismaClient,
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await callback(tx as PrismaClient);
  });
}
```

#### 3. Add Connection Health Check
```typescript
// src/utils/health-check.util.ts
export async function checkDatabaseHealth(
  prisma: PrismaClient
): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
```

#### 4. Add Error Handler
```typescript
// src/utils/error-handler.util.ts
export function handlePrismaError(error: any): AppError {
  // Handle unique constraint violations
  if (error.code === 'P2002') {
    return new ConflictError(`Duplicate ${error.meta?.target}`);
  }
  
  // Handle not found
  if (error.code === 'P2025') {
    return new NotFoundError();
  }
  
  // Handle foreign key violations
  if (error.code === 'P2003') {
    return new ValidationError('Invalid reference');
  }
  
  return new AppError('SRV_5002', 'Database error', 500);
}
```

#### 5. Add Graceful Shutdown
```typescript
// src/utils/lifecycle.util.ts
export async function gracefulShutdown(
  prisma: PrismaClient,
  signal: string
): Promise<void> {
  console.log(`${signal} received, closing database connections...`);
  await prisma.$disconnect();
  console.log('Database connections closed');
}
```

---

### **Phase 2: Enhanced Features (Do Next)**

#### 6. Add Soft Delete Mixin
```typescript
// src/mixins/soft-delete.mixin.ts
export class SoftDeleteRepository<T> extends BaseRepository<T> {
  async softDelete(id: string): Promise<void> {
    await this.update(id, { 
      deletedAt: new Date() 
    } as any);
  }

  async restore(id: string): Promise<void> {
    await this.update(id, { 
      deletedAt: null 
    } as any);
  }

  // Override findAll to exclude soft-deleted by default
  async findAll(options?: IQueryOptions): Promise<T[]> {
    return await this.findAllWithDeleted({
      ...options,
      filters: {
        ...options?.filters,
        deletedAt: null,
      },
    });
  }

  abstract findAllWithDeleted(options?: IQueryOptions): Promise<T[]>;
}
```

#### 7. Add Search Builder
```typescript
// src/utils/search-builder.util.ts
export function buildSearchQuery(
  searchTerm: string,
  searchFields: string[]
) {
  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  };
}
```

#### 8. Add Bulk Operations
```typescript
// src/utils/bulk-operations.util.ts
export async function bulkCreate<T>(
  prisma: PrismaClient,
  model: string,
  data: any[]
): Promise<number> {
  const result = await (prisma as any)[model].createMany({
    data,
    skipDuplicates: true,
  });
  return result.count;
}

export async function bulkUpdate<T>(
  prisma: PrismaClient,
  model: string,
  where: any,
  data: any
): Promise<number> {
  const result = await (prisma as any)[model].updateMany({
    where,
    data,
  });
  return result.count;
}
```

#### 9. Add Seeding Utilities
```typescript
// src/utils/seeder.util.ts
export abstract class Seeder {
  constructor(protected prisma: PrismaClient) {}
  
  abstract seed(): Promise<void>;
  abstract clear(): Promise<void>;
}

export class SeederRunner {
  constructor(
    private prisma: PrismaClient,
    private seeders: Seeder[]
  ) {}

  async run(): Promise<void> {
    for (const seeder of this.seeders) {
      await seeder.seed();
    }
  }

  async clear(): Promise<void> {
    for (const seeder of this.seeders.reverse()) {
      await seeder.clear();
    }
  }
}
```

---

### **Phase 3: Advanced Features (Optional)**

#### 10. Add Audit Trail Support
```typescript
// src/mixins/auditable.mixin.ts
export interface IAuditable {
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuditableRepository<T extends IAuditable> 
  extends BaseRepository<T> {
  
  protected async beforeCreate(data: any, userId: string) {
    return {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };
  }

  protected async beforeUpdate(data: any, userId: string) {
    return {
      ...data,
      updatedBy: userId,
      updatedAt: new Date(),
    };
  }
}
```

#### 11. Add Query Performance Monitor
```typescript
// src/utils/query-monitor.util.ts
export function monitorSlowQueries(
  prisma: PrismaClient,
  threshold: number = 1000
) {
  prisma.$on('query', (e: any) => {
    if (e.duration > threshold) {
      console.warn(`Slow query detected (${e.duration}ms):`, {
        query: e.query,
        params: e.params,
      });
    }
  });
}
```

#### 12. Add Caching Layer
```typescript
// src/utils/cache.util.ts
export class CachedRepository<T> extends BaseRepository<T> {
  constructor(
    private cache: Cache,
    private ttl: number = 300
  ) {
    super();
  }

  async findById(id: string): Promise<T | null> {
    const cacheKey = `${this.modelName}:${id}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Fetch from DB
    const result = await super.findById(id);
    
    // Cache result
    if (result) {
      await this.cache.set(cacheKey, result, this.ttl);
    }
    
    return result;
  }

  protected abstract get modelName(): string;
}
```

---

## 📝 Implementation Priority

### **Must Have (Week 1)**
1. ✅ Remove unused scaffold files
2. ✅ Add transaction utilities
3. ✅ Add error handler for Prisma errors
4. ✅ Add connection health check
5. ✅ Add graceful shutdown
6. ✅ Update package.json dependencies
7. ✅ Create comprehensive tests

### **Should Have (Week 2)**
8. ✅ Add soft delete support
9. ✅ Add search builder
10. ✅ Add bulk operations
11. ✅ Add seeding utilities
12. ✅ Update README with examples

### **Nice to Have (Week 3+)**
13. ✅ Add audit trail support
14. ✅ Add query performance monitoring
15. ✅ Add caching layer (optional)
16. ✅ Add migration helpers
17. ✅ Add database backup utilities

---

## 🎨 Recommended File Structure

```
libs/database/src/
├── index.ts                           # Main exports
├── prisma/
│   └── client.ts                      # ✅ Prisma client factory
├── repositories/
│   └── base.repository.ts             # ✅ Base repository
├── mixins/
│   ├── soft-delete.mixin.ts          # ❌ Soft delete support
│   └── auditable.mixin.ts            # ❌ Audit trail support
├── utils/
│   ├── transaction.util.ts           # ❌ Transaction wrapper
│   ├── error-handler.util.ts         # ❌ Prisma error handler
│   ├── health-check.util.ts          # ❌ Health checks
│   ├── lifecycle.util.ts             # ❌ Graceful shutdown
│   ├── search-builder.util.ts        # ❌ Search queries
│   ├── bulk-operations.util.ts       # ❌ Bulk operations
│   ├── seeder.util.ts                # ❌ Database seeding
│   └── query-monitor.util.ts         # ❌ Performance monitoring
└── __tests__/
    ├── base.repository.spec.ts       # ❌ Repository tests
    ├── transaction.util.spec.ts      # ❌ Transaction tests
    └── error-handler.spec.ts         # ❌ Error handler tests
```

---

## 📦 Package.json Updates Needed

```json
{
  "dependencies": {
    "tslib": "^2.3.0",
    "@prisma/client": "*"  // Use workspace version
  }
}
```

---

## 🎯 Example Usage After Implementation

### Transaction Example
```typescript
import { executeInTransaction } from '@courses/database';

await executeInTransaction(prisma, async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.enrollment.create({ 
    data: { userId: user.id, courseId } 
  });
  return user;
});
```

### Error Handling Example
```typescript
import { handlePrismaError } from '@courses/database';

try {
  await prisma.user.create({ data });
} catch (error) {
  throw handlePrismaError(error);
}
```

### Soft Delete Example
```typescript
class UserRepository extends SoftDeleteRepository<User> {
  // Automatically excludes soft-deleted
  async findAll(options?: IQueryOptions) {
    return super.findAll(options);
  }
  
  // Include soft-deleted when needed
  async findAllWithDeleted(options?: IQueryOptions) {
    return this.prisma.user.findMany(options);
  }
}
```

---

## 📊 Summary

| Feature | Status | Priority | Effort |
|---------|--------|----------|--------|
| Base Repository | ✅ Done | - | - |
| Prisma Client Factory | ✅ Done | - | - |
| Remove Scaffolds | ❌ TODO | 🔴 High | 5 min |
| Transaction Utils | ❌ TODO | 🔴 High | 30 min |
| Error Handler | ❌ TODO | 🔴 High | 1 hour |
| Health Check | ❌ TODO | 🔴 High | 15 min |
| Graceful Shutdown | ❌ TODO | 🔴 High | 15 min |
| Soft Delete | ❌ TODO | 🟡 Medium | 1 hour |
| Search Builder | ❌ TODO | 🟡 Medium | 30 min |
| Bulk Operations | ❌ TODO | 🟡 Medium | 45 min |
| Seeding Utils | ❌ TODO | 🟡 Medium | 1 hour |
| Audit Trail | ❌ TODO | 🟢 Low | 1 hour |
| Query Monitor | ❌ TODO | 🟢 Low | 30 min |
| Tests | ❌ TODO | 🔴 High | 4 hours |

**Estimated Total Effort:** ~12 hours for all features
**Minimum Viable:** ~2-3 hours (High priority items only)
