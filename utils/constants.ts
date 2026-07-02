/**
 * Application constants
 */

export const APP_NAME = "Vikas ERP";
export const CURRENCY_SYMBOL = "₹";

const envUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').trim();
// Ensure no double slash or trailing /api if user accidentally added it
export const API_BASE_URL = envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // Super Admin
  SUPER_ADMIN: {
    SCHOOLS: '/super-admin/schools',
    PLANS: '/super-admin/plans',
    SYSTEM_LOGS: '/super-admin/system-logs',
  },
  // Admin modules
  USERS: '/users',
  STUDENTS: '/students',
  PARENTS: '/parents',
  TEACHERS: '/teachers',
  CLASSES: '/classes',
  SECTIONS: '/sections',
  SUBJECTS: '/subjects',
  ATTENDANCE: '/attendance',
  TIMETABLE: '/timetable',
  EXAMS: '/exams',
  HOMEWORK: '/homework',
  FEES: '/fees',
  TRANSPORT: '/transport',
  COMMUNICATION: {
    NOTICES: '/communication/notices',
    SMS: '/communication/sms',
    EMAIL: '/communication/email',
    CHAT: '/chat',
  },
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  AUDIT: '/audit',
  SUPPORT: '/support',
} as const;

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  ACCESS_TOKEN: 'access_token',
} as const;
