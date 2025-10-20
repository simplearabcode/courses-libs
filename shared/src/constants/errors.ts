/**
 * Error codes and messages
 */

export const ErrorCodes = {
  // Authentication errors (1xxx)
  AUTH_INVALID_CREDENTIALS: 'AUTH_1001',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_1002',
  AUTH_ACCOUNT_LOCKED: 'AUTH_1003',
  AUTH_ACCOUNT_DISABLED: 'AUTH_1004',
  AUTH_TOKEN_EXPIRED: 'AUTH_1005',
  AUTH_TOKEN_INVALID: 'AUTH_1006',
  AUTH_UNAUTHORIZED: 'AUTH_1007',
  AUTH_FORBIDDEN: 'AUTH_1008',
  AUTH_SESSION_NOT_FOUND: 'AUTH_1009',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_1010',
  AUTH_INVALID_TOKEN: 'AUTH_1011',
  AUTH_PASSWORD_RESET_EXPIRED: 'AUTH_1012',

  // Validation errors (2xxx)
  VALIDATION_FAILED: 'VAL_2001',
  VALIDATION_EMAIL_INVALID: 'VAL_2002',
  VALIDATION_PASSWORD_WEAK: 'VAL_2003',
  VALIDATION_REQUIRED_FIELD: 'VAL_2004',
  VALIDATION_INVALID_FORMAT: 'VAL_2005',

  // Resource errors (3xxx)
  RESOURCE_NOT_FOUND: 'RES_3001',
  RESOURCE_ALREADY_EXISTS: 'RES_3002',
  RESOURCE_CONFLICT: 'RES_3003',

  // Course errors (4xxx)
  COURSE_NOT_FOUND: 'COURSE_4001',
  COURSE_NOT_PUBLISHED: 'COURSE_4002',
  COURSE_ALREADY_ENROLLED: 'COURSE_4003',
  COURSE_MAX_STUDENTS_REACHED: 'COURSE_4004',
  COURSE_NOT_AVAILABLE: 'COURSE_4005',
  SECTION_NOT_FOUND: 'SECTION_4006',
  LESSON_NOT_FOUND: 'LESSON_4007',
  LESSON_LOCKED: 'LESSON_4008',
  CATEGORY_NOT_FOUND: 'CATEGORY_4009',

  // Enrollment errors (4xxx)
  ENROLLMENT_NOT_FOUND: 'ENROLL_4101',
  ENROLLMENT_EXPIRED: 'ENROLL_4102',
  ENROLLMENT_SUSPENDED: 'ENROLL_4103',
  ENROLLMENT_REQUIRED: 'ENROLL_4104',

  // Assessment errors (6xxx)
  QUIZ_NOT_FOUND: 'QUIZ_6001',
  QUIZ_ALREADY_SUBMITTED: 'QUIZ_6002',
  QUIZ_TIME_EXPIRED: 'QUIZ_6003',
  QUIZ_MAX_ATTEMPTS_REACHED: 'QUIZ_6004',
  ASSIGNMENT_NOT_FOUND: 'ASSIGN_6005',
  ASSIGNMENT_LATE_SUBMISSION_NOT_ALLOWED: 'ASSIGN_6006',
  QUESTION_NOT_FOUND: 'QUESTION_6007',

  // Payment errors (7xxx)
  PAYMENT_FAILED: 'PAY_7001',
  PAYMENT_ALREADY_PROCESSED: 'PAY_7002',
  PAYMENT_AMOUNT_MISMATCH: 'PAY_7003',
  PAYMENT_PROVIDER_ERROR: 'PAY_7004',
  REFUND_FAILED: 'PAY_7005',

  // Certificate errors (8xxx)
  CERTIFICATE_NOT_FOUND: 'CERT_8001',
  CERTIFICATE_NOT_ELIGIBLE: 'CERT_8002',
  CERTIFICATE_ALREADY_ISSUED: 'CERT_8003',

  // Server errors (5xxx)
  SERVER_INTERNAL_ERROR: 'SRV_5001',
  SERVER_DATABASE_ERROR: 'SRV_5002',
  SERVER_EXTERNAL_SERVICE_ERROR: 'SRV_5003',
  SERVER_RATE_LIMIT_EXCEEDED: 'SRV_5004',
} as const;

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: 'Email not verified. Please check your email',
  [ErrorCodes.AUTH_ACCOUNT_LOCKED]: 'Account is locked due to too many failed login attempts',
  [ErrorCodes.AUTH_ACCOUNT_DISABLED]: 'Account has been disabled',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'Authentication required',
  [ErrorCodes.AUTH_FORBIDDEN]: 'You do not have permission to access this resource',
  [ErrorCodes.AUTH_SESSION_NOT_FOUND]: 'Session not found or expired',
  [ErrorCodes.AUTH_EMAIL_ALREADY_EXISTS]: 'Email address already registered',
  [ErrorCodes.AUTH_INVALID_TOKEN]: 'Invalid verification token',
  [ErrorCodes.AUTH_PASSWORD_RESET_EXPIRED]: 'Password reset token has expired',

  [ErrorCodes.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCodes.VALIDATION_EMAIL_INVALID]: 'Invalid email address',
  [ErrorCodes.VALIDATION_PASSWORD_WEAK]: 'Password does not meet security requirements',
  [ErrorCodes.VALIDATION_REQUIRED_FIELD]: 'Required field is missing',
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: 'Invalid format',

  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCodes.RESOURCE_CONFLICT]: 'Resource conflict',

  [ErrorCodes.COURSE_NOT_FOUND]: 'Course not found',
  [ErrorCodes.COURSE_NOT_PUBLISHED]: 'Course is not published',
  [ErrorCodes.COURSE_ALREADY_ENROLLED]: 'You are already enrolled in this course',
  [ErrorCodes.COURSE_MAX_STUDENTS_REACHED]: 'Maximum number of students reached',
  [ErrorCodes.COURSE_NOT_AVAILABLE]: 'Course is not available',
  [ErrorCodes.SECTION_NOT_FOUND]: 'Section not found',
  [ErrorCodes.LESSON_NOT_FOUND]: 'Lesson not found',
  [ErrorCodes.LESSON_LOCKED]: 'This lesson is locked. Complete previous lessons first',
  [ErrorCodes.CATEGORY_NOT_FOUND]: 'Category not found',

  [ErrorCodes.ENROLLMENT_NOT_FOUND]: 'Enrollment not found',
  [ErrorCodes.ENROLLMENT_EXPIRED]: 'Your enrollment has expired',
  [ErrorCodes.ENROLLMENT_SUSPENDED]: 'Your enrollment has been suspended',
  [ErrorCodes.ENROLLMENT_REQUIRED]: 'You must be enrolled to access this content',

  [ErrorCodes.QUIZ_NOT_FOUND]: 'Quiz not found',
  [ErrorCodes.QUIZ_ALREADY_SUBMITTED]: 'Quiz already submitted',
  [ErrorCodes.QUIZ_TIME_EXPIRED]: 'Quiz time has expired',
  [ErrorCodes.QUIZ_MAX_ATTEMPTS_REACHED]: 'Maximum quiz attempts reached',
  [ErrorCodes.ASSIGNMENT_NOT_FOUND]: 'Assignment not found',
  [ErrorCodes.ASSIGNMENT_LATE_SUBMISSION_NOT_ALLOWED]: 'Late submission not allowed',
  [ErrorCodes.QUESTION_NOT_FOUND]: 'Question not found',

  [ErrorCodes.PAYMENT_FAILED]: 'Payment failed',
  [ErrorCodes.PAYMENT_ALREADY_PROCESSED]: 'Payment already processed',
  [ErrorCodes.PAYMENT_AMOUNT_MISMATCH]: 'Payment amount does not match',
  [ErrorCodes.PAYMENT_PROVIDER_ERROR]: 'Payment provider error',
  [ErrorCodes.REFUND_FAILED]: 'Refund failed',

  [ErrorCodes.CERTIFICATE_NOT_FOUND]: 'Certificate not found',
  [ErrorCodes.CERTIFICATE_NOT_ELIGIBLE]: 'Not eligible for certificate',
  [ErrorCodes.CERTIFICATE_ALREADY_ISSUED]: 'Certificate already issued',

  [ErrorCodes.SERVER_INTERNAL_ERROR]: 'Internal server error',
  [ErrorCodes.SERVER_DATABASE_ERROR]: 'Database error occurred',
  [ErrorCodes.SERVER_EXTERNAL_SERVICE_ERROR]: 'External service error',
  [ErrorCodes.SERVER_RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again later',
};

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
