import { ParentProvider } from '@/contexts/ParentContext';
import ParentDashboard from '@/modules/parent/dashboard/ParentDashboard';

export default function DashboardPage() {
    return (
        <ParentProvider>
            <ParentDashboard />
        </ParentProvider>
    );
}
