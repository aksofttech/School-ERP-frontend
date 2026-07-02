import AdminLayout from '@/components/layouts/AdminLayout';
import UserProfile from '@/modules/admin/users/profile/UserProfile';

export default function UserEditPage() {
    return (
        <AdminLayout>
            <UserProfile />
        </AdminLayout>
    );
}
