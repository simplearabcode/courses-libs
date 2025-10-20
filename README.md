# @courses/libs - Shared Libraries

Shared TypeScript libraries for the Simple Arab Code courses platform microservices architecture.

## 📦 Libraries

### **@courses/shared**
Core shared library providing types, interfaces, constants, DTOs, and utilities.

- **Types**: User, Course, Enrollment, Assessment, Payment, Notification types
- **Constants**: Error codes, roles, and permissions
- **DTOs**: Pagination, filters, and request/response structures  
- **Utilities**: Logger, password hashing, token generation, validation, date operations
- **Coverage**: 97 tests, 100% passing

[📖 Documentation](./shared/README.md)

### **@courses/common**
Common Fastify middleware, error handling, and validators for all services.

- **Middleware**: Authentication, authorization, error handling, rate limiting, request logging
- **Errors**: Standardized error classes and HTTP error responses
- **Validators**: Base validator, course validator using AJV
- **Response Utils**: Standardized API response builders

[📖 Documentation](./common/README.md)

### **@courses/database**
Database utilities, repositories, and Prisma client management.

- **Prisma Client**: Centralized client with connection pooling
- **Base Repository**: Generic CRUD operations with TypeScript generics
- **Utilities**: Transaction handling, error mapping, health checks, lifecycle management
- **Mixins**: Soft delete functionality
- **Coverage**: 100% test coverage

[📖 Documentation](./database/README.md)

### **@courses/events**
Event-driven communication library with RabbitMQ implementation.

- **Event Bus**: RabbitMQ with fallback in-memory bus for testing
- **Event Catalog**: 70+ standardized event types across 7 domains
- **Event Types**: User, Course, Enrollment, Assessment, Payment, Certificate, Notification events
- **Handlers**: Base interfaces for event processing

[📖 Documentation](./events/README.md)

## 🏗 Architecture

This is a **pnpm workspace monorepo** using **NX** for build orchestration. All libraries are designed to work together as part of a microservices architecture.

### Dependency Graph
```
@courses/shared (foundation)
    ↑
    ├── @courses/common (depends on shared)
    ├── @courses/database (depends on shared)
    └── @courses/events (independent)
```

## 🚀 Installation

### Using pnpm workspace (Recommended)

```bash
# Install all dependencies
pnpm install

# Build all libraries
pnpm build:all

# Test all libraries
pnpm test:all
```

### Using as Git Submodule

```bash
# Add as submodule
git submodule add https://github.com/simplearabcode/courses-libs libs

# Install dependencies
cd libs && pnpm install
```

### Using Individual Libraries

Each library can be referenced in your `package.json`:

```json
{
  "dependencies": {
    "@courses/shared": "workspace:*",
    "@courses/common": "workspace:*",
    "@courses/database": "workspace:*",
    "@courses/events": "workspace:*"
  }
}
```

## 📚 Usage Examples

### Importing from Libraries

```typescript
// Shared types and utilities
import { 
  createLogger, 
  PasswordUtil, 
  ValidationUtil,
  PaginationParams,
  ErrorCodes,
  Role 
} from '@courses/shared';

// Common middleware
import { 
  authMiddleware, 
  authorizeMiddleware,
  errorHandler 
} from '@courses/common';

// Database utilities
import { 
  PrismaClient, 
  BaseRepository,
  withTransaction 
} from '@courses/database';

// Event bus
import { 
  RabbitMQEventBus, 
  CourseEventTypes,
  UserEventTypes 
} from '@courses/events';
```

### Example: Building a Service

```typescript
import Fastify from 'fastify';
import { authMiddleware, errorHandler } from '@courses/common';
import { createLogger } from '@courses/shared';
import { PrismaClient } from '@courses/database';
import { RabbitMQEventBus } from '@courses/events';

const app = Fastify();
const logger = createLogger('my-service');
const db = new PrismaClient();
const eventBus = new RabbitMQEventBus({ url: process.env.RABBITMQ_URL });

// Add middleware
app.addHook('preHandler', authMiddleware);
app.setErrorHandler(errorHandler);

// Your routes here...

await eventBus.connect();
app.listen({ port: 3000 });
```

## 🛠 Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- TypeScript 5+

### Setup

```bash
# Clone the repository
git clone https://github.com/simplearabcode/courses-libs
cd courses-libs

# Install dependencies
pnpm install

# Build all libraries
pnpm build:all

# Run tests
pnpm test:all

# Run tests with coverage
pnpm test:coverage
```

### Available Scripts

```bash
# Build
pnpm build:all              # Build all libraries
pnpm build:shared           # Build @courses/shared
pnpm build:common           # Build @courses/common
pnpm build:database         # Build @courses/database
pnpm build:events           # Build @courses/events

# Testing
pnpm test:all               # Test all libraries
pnpm test:shared            # Test @courses/shared
pnpm test:common            # Test @courses/common
pnpm test:database          # Test @courses/database
pnpm test:events            # Test @courses/events
pnpm test:coverage          # Test with coverage report

# Code Quality
pnpm lint                   # Lint all libraries
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code with Prettier
pnpm format:check           # Check formatting
```

## 📊 Library Stats

| Library | Size | Tests | Coverage | Dependencies |
|---------|------|-------|----------|--------------|
| shared | ~50KB | 97 | 100% | pino, bcrypt |
| common | ~30KB | TBD | TBD | fastify, @courses/shared |
| database | ~20KB | 15 | 100% | @prisma/client, @courses/shared |
| events | ~40KB | TBD | TBD | amqplib |

## 🔄 Versioning

Current version: **0.0.1**

We follow [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## 📖 Documentation

- [Shared Library Docs](./shared/README.md)
- [Common Library Docs](./common/README.md)
- [Database Library Docs](./database/README.md)
- [Events Library Docs](./events/README.md)
- [Complete Implementation Summary](./COMPLETE-IMPLEMENTATION-SUMMARY.md)
- [Shared Libraries Analysis](./SHARED-LIBRARIES-ANALYSIS.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Write tests for new features
- Follow existing code style
- Update documentation
- Keep libraries focused and minimal
- Avoid adding unnecessary dependencies

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

## 🏢 Organization

Maintained by [Simple Arab Code](https://github.com/simplearabcode)

## 📧 Support

For issues and questions:
- Open an [issue](https://github.com/simplearabcode/courses-libs/issues)
- Contact: support@simplearabcode.com

---

**Built with ❤️ for the Simple Arab Code learning platform**
