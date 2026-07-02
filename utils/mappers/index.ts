import { Student, Teacher } from '@/utils/types';

/**
 * Data mappers - Transform raw API data to frontend models
 * All API responses must be transformed via mappers before use in UI
 */

// Example mapper structure - extend as needed
export const mapUser = (data: any) => ({
  id: data.id,
  email: data.email,
  firstName: data.firstName || data.first_name,
  lastName: data.lastName || data.last_name,
  role: data.role,
  schoolId: data.schoolId || data.school_id,
  phone: data.phone,
  avatar: data.avatar,
});

// Add more mappers as needed
export const mapStudent = (data: any): Student => {
  const user = data.user || {};
  return {
    id: data.id,
    user: {
      id: user.id || '',
      email: user.email || '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'STUDENT',
      isActive: user.isActive,
      phone: user.phone,
    },
    rollNumber: data.rollNumber || '',
    firstName: user.firstName || data.firstName || '',
    lastName: user.lastName || data.lastName || '',
    email: user.email || data.email || '',
    phone: user.phone || data.phone,
    dob: data.dob || '',
    gender: data.gender,
    classId: data.classId || '',
    class: data.class ? { id: data.class.id, name: data.class.name } : undefined,
    sectionId: data.sectionId || '',
    section: data.section ? { id: data.section.id, name: data.section.name, classId: data.classId } : undefined,
    schoolId: data.schoolId || '',
    parentId: data.parentId,
    status: user.isActive ? 'ACTIVE' : 'INACTIVE',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const mapTeacher = (data: any): Teacher => {
  const user = data.user || {};
  return {
    id: data.id,
    firstName: user.firstName || data.firstName || '',
    lastName: user.lastName || data.lastName || '',
    email: user.email || data.email || '',
    phone: user.phone || data.phone,
    employeeId: data.employeeId || '',
    subjects: data.subjects || [],
    status: user.isActive ? 'ACTIVE' : 'INACTIVE',
  };
};

// Generic mapper for arrays
export const mapArray = <T>(mapper: (item: any) => T) => (data: any[]): T[] => {
  return (data || []).map(mapper);
};
