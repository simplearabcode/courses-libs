/**
 * Course-related types and enums
 */

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ALL_LEVELS = 'ALL_LEVELS',
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum CourseVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
}

export interface ICourse {
  id: string;
  instructorId: string;
  title: string;
  description: string;
  shortDescription?: string;
  slug: string;
  thumbnail?: string;
  previewVideo?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  level: CourseLevel;
  status: CourseStatus;
  visibility: CourseVisibility;
  isFeatured: boolean;
  language: string;
  duration?: number;
  requirements: string[];
  objectives: string[];
  tags: string[];
  certificateEnabled: boolean;
  maxStudents?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ISection {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  LIVE_SESSION = 'LIVE_SESSION',
  RESOURCE = 'RESOURCE',
}

export interface ILesson {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  videoUrl?: string;
  videoDuration?: number;
  attachments?: Record<string, unknown>;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
