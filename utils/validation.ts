import * as z from 'zod';

export const studentSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
    rollNumber: z.string().min(3, 'Roll number is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    classId: z.string().uuid('Invalid Class Selection'),
    sectionId: z.string().uuid('Invalid Section Selection'),
    password: z.string().min(8, 'Password must be at least 8 characters'),

    parentId: z.string().optional(),
    // Parent details for new creation
    parentFirstName: z.string().optional().or(z.literal('')),
    parentLastName: z.string().optional().or(z.literal('')),
    parentEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    parentPhone: z.string().optional().or(z.literal('')),
    parentFatherName: z.string().optional().or(z.literal('')),
    parentMotherName: z.string().optional().or(z.literal('')),
    parentAddress: z.string().optional().or(z.literal('')),
    parentSecondaryPhone: z.string().optional().or(z.literal('')),
});

export type StudentSchema = z.infer<typeof studentSchema>;
export const teacherSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
    department: z.string().min(1, 'Please select a department'),
    designation: z.string().min(2, 'Designation is required'),
    joiningDate: z.string().optional(),
    qualification: z.string().optional(),
    address: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const subjectSchema = z.object({
    name: z.string().min(2, 'Subject name must be at least 2 characters'),
    code: z.string().min(2, 'Subject code must be at least 2 characters'),
    description: z.string().optional(),
    credits: z.number().min(0).optional(),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
