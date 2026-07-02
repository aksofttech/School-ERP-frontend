/**
 * Centralized role configuration
 * Single source of truth for role-to-route mapping
 * 
 * This file ensures consistency across:
 * - Login redirect logic
 * - Role guards
 * - Route protection
 * - Type safety
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Role to dashboard route mapping
 * This is the single source of truth for role-based routing
 */
export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
  [USER_ROLES.SCHOOL_ADMIN]: '/admin/dashboard',
  [USER_ROLES.TEACHER]: '/teacher/dashboard',
  [USER_ROLES.STUDENT]: '/student/dashboard',
  [USER_ROLES.PARENT]: '/parent/dashboard',
} as const;

/**
 * Get dashboard route for a given role
 * @param role - User role string from backend
 * @returns Dashboard route or null if invalid role
 */
export function getDashboardRoute(role: string | null | undefined): string | null {
  if (!role || typeof role !== 'string') {
    return null;
  }
  
  // Normalize role to uppercase for comparison
  const normalizedRole = role.toUpperCase();
  
  // Check if role exists in map
  if (normalizedRole in ROLE_DASHBOARD_MAP) {
    return ROLE_DASHBOARD_MAP[normalizedRole as UserRole];
  }
  
  return null;
}

/**
 * Validate if role is valid
 * @param role - Role string to validate
 * @returns True if role is valid, false otherwise
 */
export function isValidRole(role: string | null | undefined): role is UserRole {
  if (!role || typeof role !== 'string') {
    return false;
  }
  
  const normalizedRole = role.toUpperCase();
  return normalizedRole in USER_ROLES;
}

/**
 * Get all valid roles as array
 */
export function getAllRoles(): UserRole[] {
  return Object.values(USER_ROLES);
}

/**
 * Check if user has any of the specified roles
 * @param userRole - User's role
 * @param allowedRoles - Array of allowed roles
 * @returns True if user role is in allowed roles
 */
export function hasRole(userRole: string | null | undefined, allowedRoles: UserRole[]): boolean {
  if (!isValidRole(userRole)) {
    return false;
  }
  
  return allowedRoles.includes(userRole);
}
