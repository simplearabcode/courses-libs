/**
 * Assessment (Quiz & Assignment) event types
 */

export const AssessmentEventTypes = {
  // Quiz events
  QUIZ_CREATED: 'assessment.quiz.created',
  QUIZ_UPDATED: 'assessment.quiz.updated',
  QUIZ_PUBLISHED: 'assessment.quiz.published',
  QUIZ_DELETED: 'assessment.quiz.deleted',
  QUIZ_STARTED: 'assessment.quiz.started',
  QUIZ_SUBMITTED: 'assessment.quiz.submitted',
  QUIZ_GRADED: 'assessment.quiz.graded',
  QUIZ_PASSED: 'assessment.quiz.passed',
  QUIZ_FAILED: 'assessment.quiz.failed',

  // Assignment events
  ASSIGNMENT_CREATED: 'assessment.assignment.created',
  ASSIGNMENT_UPDATED: 'assessment.assignment.updated',
  ASSIGNMENT_PUBLISHED: 'assessment.assignment.published',
  ASSIGNMENT_DELETED: 'assessment.assignment.deleted',
  ASSIGNMENT_SUBMITTED: 'assessment.assignment.submitted',
  ASSIGNMENT_GRADED: 'assessment.assignment.graded',
  ASSIGNMENT_RESUBMITTED: 'assessment.assignment.resubmitted',
} as const;

export type AssessmentEventType = (typeof AssessmentEventTypes)[keyof typeof AssessmentEventTypes];

// Quiz event payloads
export interface IQuizCreatedPayload {
  quizId: string;
  lessonId: string;
  courseId: string;
  title: string;
  passingScore: number;
  timeLimit?: number;
  maxAttempts?: number;
  timestamp: Date;
}

export interface IQuizUpdatedPayload {
  quizId: string;
  lessonId: string;
  courseId: string;
  updatedFields: string[];
  timestamp: Date;
}

export interface IQuizPublishedPayload {
  quizId: string;
  lessonId: string;
  courseId: string;
  title: string;
  timestamp: Date;
}

export interface IQuizDeletedPayload {
  quizId: string;
  lessonId: string;
  courseId: string;
  timestamp: Date;
}

export interface IQuizStartedPayload {
  attemptId: string;
  quizId: string;
  studentId: string;
  courseId: string;
  attemptNumber: number;
  startedAt: Date;
  timestamp: Date;
}

export interface IQuizSubmittedPayload {
  attemptId: string;
  quizId: string;
  studentId: string;
  courseId: string;
  submittedAt: Date;
  timeSpent: number; // seconds
  timestamp: Date;
}

export interface IQuizGradedPayload {
  attemptId: string;
  quizId: string;
  studentId: string;
  courseId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timestamp: Date;
}

export interface IQuizPassedPayload {
  attemptId: string;
  quizId: string;
  studentId: string;
  courseId: string;
  score: number;
  percentage: number;
  timestamp: Date;
}

export interface IQuizFailedPayload {
  attemptId: string;
  quizId: string;
  studentId: string;
  courseId: string;
  score: number;
  percentage: number;
  attemptsLeft?: number;
  timestamp: Date;
}

// Assignment event payloads
export interface IAssignmentCreatedPayload {
  assignmentId: string;
  lessonId: string;
  courseId: string;
  title: string;
  maxScore: number;
  dueDate?: Date;
  timestamp: Date;
}

export interface IAssignmentUpdatedPayload {
  assignmentId: string;
  lessonId: string;
  courseId: string;
  updatedFields: string[];
  timestamp: Date;
}

export interface IAssignmentPublishedPayload {
  assignmentId: string;
  lessonId: string;
  courseId: string;
  title: string;
  dueDate?: Date;
  timestamp: Date;
}

export interface IAssignmentDeletedPayload {
  assignmentId: string;
  lessonId: string;
  courseId: string;
  timestamp: Date;
}

export interface IAssignmentSubmittedPayload {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  submittedAt: Date;
  isLate: boolean;
  timestamp: Date;
}

export interface IAssignmentGradedPayload {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback?: string;
  gradedAt: Date;
  gradedBy: string;
  timestamp: Date;
}

export interface IAssignmentResubmittedPayload {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  resubmittedAt: Date;
  timestamp: Date;
}
