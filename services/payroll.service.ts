import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

export interface StaffPaymentRecord {
  id: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  paymentDate: string | null;
  status: 'PAID' | 'PENDING';
  paymentMethod: string;
  transactionId: string | null;
  remarks: string | null;
  staffId: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone?: string;
    teacher?: {
      qualification?: string;
      experience?: number;
    };
  };
}

export interface PayrollDashboardData {
  payments: StaffPaymentRecord[];
  stats: {
    totalPayroll: number;
    totalPaid: number;
    totalPending: number;
    paidCount: number;
    pendingCount: number;
    totalStaff: number;
  };
  availableMonths: string[];
}

export interface StaffMemberOption {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  qualification: string;
  defaultBasic: number;
  defaultAllowances: number;
  defaultDeductions: number;
}

export interface DisburseSalaryPayload {
  id?: string;
  staffId?: string;
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
  netSalary?: number;
  month?: string;
  paymentMethod?: string;
  transactionId?: string;
  remarks?: string;
  status?: string;
}

class PayrollService {
  async getDashboard(params?: { month?: string; status?: string; search?: string }): Promise<PayrollDashboardData> {
    const response: any = await apiClient.get<PayrollDashboardData>(API_ENDPOINTS.PAYROLL, { params });
    return response.data || response;
  }

  async getStaffList(): Promise<StaffMemberOption[]> {
    const response: any = await apiClient.get<StaffMemberOption[]>(`${API_ENDPOINTS.PAYROLL}/staff`);
    return response.data || response;
  }

  async disburse(payload: DisburseSalaryPayload): Promise<StaffPaymentRecord> {
    const response: any = await apiClient.post<StaffPaymentRecord>(`${API_ENDPOINTS.PAYROLL}/disburse`, payload);
    return response.data || response;
  }
}

export const payrollService = new PayrollService();
