/**
 * Core TypeScript types for the School ERP Frontend
 */

// User roles supported in the system
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

// User profile type
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; // "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT"
  schoolId?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  profilePicture?: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'class' | 'section' | 'rollNumber' | string;
  sortOrder?: 'asc' | 'desc';
  sectionId?: string;
  classId?: string;
  search?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ✅ LOGIN RESPONSE (MATCHES BACKEND)
export interface LoginResponse {
  access_token: string;
  user: User;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// ================================
// Domain Models
// ================================

// Student
export interface Student {
  id: string;
  user: User;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  classId: string;
  class?: Class;
  sectionId: string;
  section?: Section;
  parentId?: string;
  parents?: Parent[];
  schoolId: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  rollNumber: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  classId: string;
  sectionId: string;
  parentId?: string;
  // New Parent Creation Fields
  parentFirstName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentPhone?: string;
  parentFatherName?: string;
  parentMotherName?: string;
  parentAddress?: string;
  parentSecondaryPhone?: string;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> { }

// Teacher
export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  department?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  dateOfJoining?: string;
  schoolId?: string;
  subjects?: Subject[];
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  profilePicture?: string;
  address?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  department?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  dateOfJoining?: string;
  subjectIds?: string[];
  address?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface UpdateTeacherDto extends Partial<CreateTeacherDto> { }

// Class
export interface Class {
  id: string;
  name: string;
  numericName?: number; // Added for numeric level/grade
  grade?: string;
  description?: string;
  schoolId?: string;
  sections?: Section[];
  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    students?: number;
    sections?: number;
    exams?: number;
  };
}

export interface CreateClassDto {
  name: string;
  numericName?: number;
  grade?: string;
  description?: string;
  teacherId?: string;
}

export interface UpdateClassDto extends Partial<CreateClassDto> { }

// Section
export interface Section {
  id: string;
  name: string;
  classId: string;
  capacity?: number;
  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    students?: number;
  };
}

// Subject
export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    timetables?: number;
    homeworks?: number;
  };
}

export interface CreateSubjectDto {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateSubjectDto extends Partial<CreateSubjectDto> { }

// Parent
export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  secondaryPhone?: string;
  occupation?: string;
  address?: string;
  students?: Student[];
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Attendance
export interface Attendance {
  id: string;
  studentId: string;
  classId?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttendanceDto {
  studentId: string;
  classId?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

// Exam
export interface Exam {
  id: string;
  name: string;
  type: string;
  date: string;
  classId: string;
  class?: Class;
  totalMarks: number;
  passingMarks: number;
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExamDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  classId?: string;
  subjectId?: string;
  totalMarks?: number;
  passingMarks?: number;
}

// Fee
export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  feeType: string;
  description?: string;
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Homework
export interface Homework {
  id: string;
  title: string;
  description?: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dueDate: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Timetable Entry
export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  room?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Communication / Notice
export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'URGENT' | 'EVENT';
  targetRoles?: string[];
  publishedAt?: string;
  expiresAt?: string;
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Document
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  uploadedBy?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: string;
  updatedAt?: string;
}
