import AdminLayout from '@/components/layouts/AdminLayout';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function AcademicCalendarPage() {
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <CalendarIcon size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Academic Calendar</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon size={32} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Calendar Module Under Construction</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        The academic calendar feature is currently being developed. You will be able to manage events, holidays, and schedule important dates here soon.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
