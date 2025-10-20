/**
 * Course-related event types and payloads
 */

export const CourseEventTypes = {
  // Course lifecycle
  COURSE_CREATED: 'course.created',
  COURSE_UPDATED: 'course.updated',
  COURSE_PUBLISHED: 'course.published',
  COURSE_UNPUBLISHED: 'course.unpublished',
  COURSE_DELETED: 'course.deleted',
  COURSE_ARCHIVED: 'course.archived',

  // Sections
  SECTION_CREATED: 'course.section.created',
  SECTION_UPDATED: 'course.section.updated',
  SECTION_DELETED: 'course.section.deleted',
  SECTION_REORDERED: 'course.section.reordered',

  // Lessons
  LESSON_CREATED: 'course.lesson.created',
  LESSON_UPDATED: 'course.lesson.updated',
  LESSON_PUBLISHED: 'course.lesson.published',
  LESSON_DELETED: 'course.lesson.deleted',
  LESSON_COMPLETED: 'course.lesson.completed',
  LESSON_VIEWED: 'course.lesson.viewed',
} as const;

export type CourseEventType = (typeof CourseEventTypes)[keyof typeof CourseEventTypes];

// Course event payloads
export interface ICourseCreatedPayload {
  courseId: string;
  instructorId: string;
  title: string;
  level: string;
  price: number;
  currency: string;
  timestamp: Date;
}

export interface ICourseUpdatedPayload {
  courseId: string;
  instructorId: string;
  updatedFields: string[];
  timestamp: Date;
}

export interface ICoursePublishedPayload {
  courseId: string;
  instructorId: string;
  title: string;
  publishedAt: Date;
  timestamp: Date;
}

export interface ICourseUnpublishedPayload {
  courseId: string;
  instructorId: string;
  reason?: string;
  timestamp: Date;
}

export interface ICourseDeletedPayload {
  courseId: string;
  instructorId: string;
  title: string;
  timestamp: Date;
}

export interface ICourseArchivedPayload {
  courseId: string;
  instructorId: string;
  reason?: string;
  timestamp: Date;
}

export interface ISectionCreatedPayload {
  sectionId: string;
  courseId: string;
  title: string;
  position: number;
  timestamp: Date;
}

export interface ISectionUpdatedPayload {
  sectionId: string;
  courseId: string;
  updatedFields: string[];
  timestamp: Date;
}

export interface ISectionDeletedPayload {
  sectionId: string;
  courseId: string;
  timestamp: Date;
}

export interface ISectionReorderedPayload {
  courseId: string;
  sectionIds: string[];
  timestamp: Date;
}

export interface ILessonCreatedPayload {
  lessonId: string;
  sectionId: string;
  courseId: string;
  title: string;
  type: string;
  position: number;
  timestamp: Date;
}

export interface ILessonUpdatedPayload {
  lessonId: string;
  sectionId: string;
  courseId: string;
  updatedFields: string[];
  timestamp: Date;
}

export interface ILessonPublishedPayload {
  lessonId: string;
  sectionId: string;
  courseId: string;
  title: string;
  timestamp: Date;
}

export interface ILessonDeletedPayload {
  lessonId: string;
  sectionId: string;
  courseId: string;
  timestamp: Date;
}

export interface ILessonCompletedPayload {
  lessonId: string;
  sectionId: string;
  courseId: string;
  studentId: string;
  completionRate: number;
  timestamp: Date;
}

export interface ILessonViewedPayload {
  lessonId: string;
  courseId: string;
  studentId: string;
  duration: number; // seconds
  timestamp: Date;
}
