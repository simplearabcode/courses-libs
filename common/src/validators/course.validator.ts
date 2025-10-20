/**
 * Course-specific validation schemas for AJV/Fastify
 */

import { CourseLevel, CourseStatus, CourseVisibility, LessonType } from '@courses/shared';

/**
 * Course creation schema
 */
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
    compareAtPrice: {
      type: 'number',
      minimum: 0,
    },
    currency: {
      type: 'string',
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD',
    },
    language: {
      type: 'string',
      default: 'en',
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
    certificateEnabled: {
      type: 'boolean',
      default: true,
    },
    maxStudents: {
      type: 'integer',
      minimum: 1,
    },
  },
  additionalProperties: false,
} as const;

/**
 * Course update schema
 */
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
    compareAtPrice: {
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
    certificateEnabled: {
      type: 'boolean',
    },
    maxStudents: {
      type: 'integer',
      minimum: 1,
    },
  },
  additionalProperties: false,
} as const;

/**
 * Section creation schema
 */
export const sectionCreateSchema = {
  type: 'object',
  required: ['title', 'position'],
  properties: {
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
    },
    description: {
      type: 'string',
      maxLength: 500,
    },
    position: {
      type: 'integer',
      minimum: 0,
    },
  },
  additionalProperties: false,
} as const;

/**
 * Lesson creation schema
 */
export const lessonCreateSchema = {
  type: 'object',
  required: ['title', 'type', 'position'],
  properties: {
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
    },
    description: {
      type: 'string',
      maxLength: 1000,
    },
    type: {
      type: 'string',
      enum: Object.values(LessonType),
    },
    content: {
      type: 'string',
      maxLength: 50000,
    },
    videoUrl: {
      type: 'string',
      format: 'uri',
    },
    videoDuration: {
      type: 'integer',
      minimum: 0,
    },
    position: {
      type: 'integer',
      minimum: 0,
    },
    isFree: {
      type: 'boolean',
      default: false,
    },
  },
  additionalProperties: false,
} as const;

/**
 * Enrollment creation schema
 */
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

/**
 * Quiz submission schema
 */
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
          questionId: {
            type: 'string',
            format: 'uuid',
          },
          answer: {}, // Can be any type (string, number, array, etc.)
        },
      },
      minItems: 1,
    },
  },
  additionalProperties: false,
} as const;

/**
 * Assignment submission schema
 */
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

/**
 * Progress update schema
 */
export const progressUpdateSchema = {
  type: 'object',
  required: ['lessonId'],
  properties: {
    lessonId: {
      type: 'string',
      format: 'uuid',
    },
    watchTime: {
      type: 'integer',
      minimum: 0,
    },
    lastPosition: {
      type: 'integer',
      minimum: 0,
    },
    completionRate: {
      type: 'number',
      minimum: 0,
      maximum: 100,
    },
  },
  additionalProperties: false,
} as const;

/**
 * Review creation schema
 */
export const reviewCreateSchema = {
  type: 'object',
  required: ['courseId', 'rating', 'comment'],
  properties: {
    courseId: {
      type: 'string',
      format: 'uuid',
    },
    rating: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
    },
    comment: {
      type: 'string',
      minLength: 10,
      maxLength: 1000,
    },
  },
  additionalProperties: false,
} as const;
