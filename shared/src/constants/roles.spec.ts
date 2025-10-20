/**
 * Roles Constants Tests
 */

import { Role, RolePermissions, hasPermission, isRole } from './roles';

describe('Roles', () => {
  describe('Role enum', () => {
    it('should have all roles defined', () => {
      expect(Role.STUDENT).toBe('STUDENT');
      expect(Role.INSTRUCTOR).toBe('INSTRUCTOR');
      expect(Role.ADMIN).toBe('ADMIN');
    });
  });

  describe('RolePermissions', () => {
    it('should have permissions for STUDENT', () => {
      const permissions = RolePermissions[Role.STUDENT];
      expect(permissions).toContain('courses:view');
      expect(permissions).toContain('courses:enroll');
      expect(permissions).toContain('lessons:view');
    });

    it('should have permissions for INSTRUCTOR', () => {
      const permissions = RolePermissions[Role.INSTRUCTOR];
      expect(permissions).toContain('courses:create');
      expect(permissions).toContain('courses:update');
      expect(permissions).toContain('analytics:view');
    });

    it('should have wildcard permissions for ADMIN', () => {
      const permissions = RolePermissions[Role.ADMIN];
      expect(permissions).toContain('courses:*');
      expect(permissions).toContain('users:*');
    });
  });

  describe('hasPermission', () => {
    it('should allow student to view courses', () => {
      expect(hasPermission(Role.STUDENT, 'courses:view')).toBe(true);
    });

    it('should not allow student to create courses', () => {
      expect(hasPermission(Role.STUDENT, 'courses:create')).toBe(false);
    });

    it('should allow instructor to create courses', () => {
      expect(hasPermission(Role.INSTRUCTOR, 'courses:create')).toBe(true);
    });

    it('should allow admin wildcard permissions', () => {
      expect(hasPermission(Role.ADMIN, 'courses:delete')).toBe(true);
      expect(hasPermission(Role.ADMIN, 'users:manage')).toBe(true);
    });

    it('should handle resource wildcard', () => {
      expect(hasPermission(Role.INSTRUCTOR, 'lessons:delete')).toBe(true);
    });
  });

  describe('isRole', () => {
    it('should validate valid roles', () => {
      expect(isRole('STUDENT')).toBe(true);
      expect(isRole('INSTRUCTOR')).toBe(true);
      expect(isRole('ADMIN')).toBe(true);
    });

    it('should reject invalid roles', () => {
      expect(isRole('INVALID')).toBe(false);
      expect(isRole('user')).toBe(false);
    });
  });
});
