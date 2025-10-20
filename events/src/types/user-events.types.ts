/**
 * User-related event types
 */

export const UserEventTypes = {
  USER_REGISTERED: 'user.registered',
  USER_EMAIL_VERIFIED: 'user.email_verified',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  USER_PASSWORD_CHANGED: 'user.password_changed',
  USER_PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  USER_PASSWORD_RESET_COMPLETED: 'user.password_reset_completed',
  USER_PROFILE_UPDATED: 'user.profile_updated',
  USER_ROLE_CHANGED: 'user.role_changed',
  USER_DEACTIVATED: 'user.deactivated',
  USER_REACTIVATED: 'user.reactivated',
} as const;

export type UserEventType = (typeof UserEventTypes)[keyof typeof UserEventTypes];

// User event payloads
export interface IUserRegisteredPayload {
  userId: string;
  email: string;
  role: string;
  timestamp: Date;
}

export interface IUserEmailVerifiedPayload {
  userId: string;
  email: string;
  timestamp: Date;
}

export interface IUserLoggedInPayload {
  userId: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface IUserLoggedOutPayload {
  userId: string;
  sessionId: string;
  timestamp: Date;
}

export interface IUserPasswordChangedPayload {
  userId: string;
  timestamp: Date;
}

export interface IUserPasswordResetRequestedPayload {
  userId: string;
  email: string;
  timestamp: Date;
}

export interface IUserPasswordResetCompletedPayload {
  userId: string;
  timestamp: Date;
}

export interface IUserProfileUpdatedPayload {
  userId: string;
  updatedFields: string[];
  timestamp: Date;
}

export interface IUserRoleChangedPayload {
  userId: string;
  oldRole: string;
  newRole: string;
  changedBy: string;
  timestamp: Date;
}

export interface IUserDeactivatedPayload {
  userId: string;
  reason?: string;
  deactivatedBy: string;
  timestamp: Date;
}

export interface IUserReactivatedPayload {
  userId: string;
  reactivatedBy: string;
  timestamp: Date;
}
