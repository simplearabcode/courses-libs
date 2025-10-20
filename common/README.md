# @courses/common

Common utilities, middleware, validators, and error handlers shared across all microservices.

## 📦 Contents

- **Validators**: JSON Schema validation schemas using AJV (Fastify's built-in validator)
- **Middleware**: Error handlers, authentication, logging
- **Errors**: Custom error classes (AppError, ValidationError, etc.)
- **Utils**: Shared utility functions

## 🔍 Validation with AJV

This library provides reusable JSON Schema validation schemas that work with Fastify's built-in AJV validator.

### Example Usage

```typescript
import { emailSchema, passwordSchema } from '@courses/common';

const registerSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: emailSchema,
    password: passwordSchema,
  },
  additionalProperties: false,
};

// Use in Fastify route
fastify.post('/register', {
  schema: {
    body: registerSchema
  }
}, async (request, reply) => {
  // Body is automatically validated by AJV
  const { email, password } = request.body;
  return authService.register({ email, password });
});
```

## Building

Run `nx build common` to build the library.

## Running unit tests

Run `nx test common` to execute the unit tests via [Jest](https://jestjs.io).
