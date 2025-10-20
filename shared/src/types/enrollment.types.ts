/**
 * Enrollment and Progress types
 */

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  REFUNDED = 'REFUNDED',
}

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface IEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  lastAccessedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgress {
  id: string;
  studentId: string;
  lessonId: string;
  status: ProgressStatus;
  completionRate: number; // 0-100
  watchTime: number; // seconds
  lastPosition: number; // video position in seconds
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
