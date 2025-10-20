/**
 * User roles and permissions
 */

export enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

export const RolePermissions = {
  [Role.STUDENT]: [
    'courses:view',
    'courses:enroll',
    'lessons:view',
    'progress:track',
    'assessments:take',
    'certificates:view',
  ],
  [Role.INSTRUCTOR]: [
    'courses:view',
    'courses:enroll',
    'courses:create',
    'courses:update',
    'courses:delete',
    'lessons:view',
    'lessons:create',
    'lessons:update',
    'lessons:delete',
    'progress:track',
    'progress:view-all',
    'assessments:take',
    'assessments:create',
    'assessments:update',
    'assessments:delete',
    'certificates:view',
    'certificates:issue',
    'analytics:view',
  ],
  [Role.ADMIN]: [
    'courses:*',
    'lessons:*',
    'users:*',
    'progress:*',
    'assessments:*',
    'certificates:*',
    'analytics:*',
    'settings:*',
  ],
} as const;

export function hasPermission(role: Role, permission: string): boolean {
  const permissions = RolePermissions[role] as readonly string[];
  return permissions.includes(permission) || permissions.includes('*') || permissions.some(p => p.endsWith(':*') && permission.startsWith(p.split(':')[0]));
}

export function isRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}
