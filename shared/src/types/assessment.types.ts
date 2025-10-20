/**
 * Assessment, Quiz, and Assignment types
 */

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
  FILL_BLANK = 'FILL_BLANK',
}

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  RETURNED = 'RETURNED',
  LATE = 'LATE',
}

export interface IQuiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number; // percentage
  timeLimit?: number; // minutes
  maxAttempts?: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  id: string;
  quizId: string;
  type: QuestionType;
  question: string;
  options?: Record<string, unknown>;
  correctAnswer: unknown;
  explanation?: string;
  points: number;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  score?: number;
  passed?: boolean;
  answers?: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  timeSpent?: number; // seconds
  createdAt: Date;
}

export interface IAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: unknown;
  isCorrect?: boolean;
  pointsEarned?: number;
  createdAt: Date;
}

export interface IAssignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions?: string;
  attachments?: Record<string, unknown>;
  maxScore: number;
  dueDate?: Date;
  allowLateSubmission: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  attachments?: Record<string, unknown>;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
