/**
 * User-related types and interfaces
 */

import { Role } from '../constants/roles';

export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  role: Role;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  timezone?: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface IAuthPayload {
  userId: string;
  email: string;
  role: Role;
  sessionId: string;
}

export interface ILoginResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
