/**
 * Notification event types
 */

export const NotificationEventTypes = {
  // Course notifications
  NOTIFICATION_COURSE_ENROLLMENT: 'notification.course.enrollment',
  NOTIFICATION_COURSE_UPDATE: 'notification.course.update',
  NOTIFICATION_LESSON_AVAILABLE: 'notification.lesson.available',
  
  // Progress notifications
  NOTIFICATION_LESSON_COMPLETED: 'notification.progress.lesson',
  NOTIFICATION_COURSE_MILESTONE: 'notification.progress.milestone',
  NOTIFICATION_COURSE_COMPLETED: 'notification.progress.completed',
  
  // Assessment notifications
  NOTIFICATION_QUIZ_GRADED: 'notification.assessment.quiz',
  NOTIFICATION_ASSIGNMENT_GRADED: 'notification.assessment.assignment',
  NOTIFICATION_ASSIGNMENT_DUE: 'notification.assessment.due',
  
  // Payment notifications
  NOTIFICATION_PAYMENT_SUCCESS: 'notification.payment.success',
  NOTIFICATION_PAYMENT_FAILED: 'notification.payment.failed',
  NOTIFICATION_REFUND_PROCESSED: 'notification.payment.refund',
  
  // Certificate notifications
  NOTIFICATION_CERTIFICATE_ISSUED: 'notification.certificate.issued',
  
  // Discussion notifications
  NOTIFICATION_DISCUSSION_REPLY: 'notification.discussion.reply',
  NOTIFICATION_DISCUSSION_MENTION: 'notification.discussion.mention',
  
  // Enrollment notifications
  NOTIFICATION_ENROLLMENT_EXPIRING: 'notification.enrollment.expiring',
  NOTIFICATION_ENROLLMENT_EXPIRED: 'notification.enrollment.expired',
} as const;

export type NotificationEventType = (typeof NotificationEventTypes)[keyof typeof NotificationEventTypes];

// Notification event payloads
export interface INotificationPayload {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

export interface ICourseEnrollmentNotificationPayload extends INotificationPayload {
  courseId: string;
  courseTitle: string;
}

export interface ICourseUpdateNotificationPayload extends INotificationPayload {
  courseId: string;
  courseTitle: string;
  updateType: string;
}

export interface ILessonCompletedNotificationPayload extends INotificationPayload {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
}

export interface IQuizGradedNotificationPayload extends INotificationPayload {
  quizId: string;
  quizTitle: string;
  score: number;
  passed: boolean;
}

export interface IAssignmentGradedNotificationPayload extends INotificationPayload {
  assignmentId: string;
  assignmentTitle: string;
  score: number;
  feedback?: string;
}

export interface IPaymentNotificationPayload extends INotificationPayload {
  paymentId: string;
  amount: number;
  currency: string;
  courseTitle: string;
}

export interface ICertificateIssuedNotificationPayload extends INotificationPayload {
  certificateId: string;
  courseTitle: string;
  certificateUrl: string;
}
