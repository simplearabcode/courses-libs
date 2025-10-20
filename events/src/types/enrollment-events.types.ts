/**
 * Enrollment and Progress event types
 */

export const EnrollmentEventTypes = {
  // Enrollment lifecycle
  ENROLLMENT_CREATED: 'enrollment.created',
  ENROLLMENT_COMPLETED: 'enrollment.completed',
  ENROLLMENT_EXPIRED: 'enrollment.expired',
  ENROLLMENT_SUSPENDED: 'enrollment.suspended',
  ENROLLMENT_REACTIVATED: 'enrollment.reactivated',
  ENROLLMENT_REFUNDED: 'enrollment.refunded',

  // Progress tracking
  PROGRESS_UPDATED: 'progress.updated',
  PROGRESS_MILESTONE: 'progress.milestone',
  COURSE_STARTED: 'progress.course.started',
  COURSE_COMPLETED: 'progress.course.completed',
} as const;

export type EnrollmentEventType = (typeof EnrollmentEventTypes)[keyof typeof EnrollmentEventTypes];

// Enrollment event payloads
export interface IEnrollmentCreatedPayload {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  price: number;
  currency: string;
  startedAt: Date;
  expiresAt?: Date;
  timestamp: Date;
}

export interface IEnrollmentCompletedPayload {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  completedAt: Date;
  duration: number; // days from start to completion
  timestamp: Date;
}

export interface IEnrollmentExpiredPayload {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  expiresAt: Date;
  timestamp: Date;
}

export interface IEnrollmentSuspendedPayload {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  reason: string;
  suspendedBy: string;
  timestamp: Date;
}

export interface IEnrollmentReactivatedPayload {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  reactivatedBy: string;
  timestamp: Date;
}

export interface IEnrollmentRefundedPayload {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  refundAmount: number;
  currency: string;
  reason?: string;
  timestamp: Date;
}

export interface IProgressUpdatedPayload {
  progressId: string;
  studentId: string;
  lessonId: string;
  courseId: string;
  completionRate: number;
  watchTime: number; // seconds
  isCompleted: boolean;
  timestamp: Date;
}

export interface IProgressMilestonePayload {
  studentId: string;
  courseId: string;
  courseTitle: string;
  milestone: 25 | 50 | 75 | 100;
  completedLessons: number;
  totalLessons: number;
  timestamp: Date;
}

export interface ICourseStartedPayload {
  studentId: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  timestamp: Date;
}

export interface ICourseCompletedPayload {
  studentId: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  completedAt: Date;
  duration: number; // days
  certificateEligible: boolean;
  timestamp: Date;
}
