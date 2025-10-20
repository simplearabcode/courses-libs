/**
 * Notification types and enums
 */

export enum NotificationType {
  COURSE_ENROLLMENT = 'COURSE_ENROLLMENT',
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  QUIZ_GRADED = 'QUIZ_GRADED',
  ASSIGNMENT_GRADED = 'ASSIGNMENT_GRADED',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  NEW_DISCUSSION = 'NEW_DISCUSSION',
  DISCUSSION_REPLY = 'DISCUSSION_REPLY',
  COURSE_UPDATE = 'COURSE_UPDATE',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
