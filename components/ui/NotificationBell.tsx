import React, { useState } from 'react';
import { Bell, Check, Loader2, Info, AlertTriangle } from 'lucide-react';
import { notificationsService } from '@/services/notifications.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

export const NotificationBell = () => {
    const queryClient = useQueryClient();
    const [markingLoading, setMarkingLoading] = useState(false);

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const data = await notificationsService.getNotifications(10);
            return data || [];
        },
        refetchInterval: 60000, // Stale-while-revalidate / Poll every 60s natively
    });

    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationsService.markAsRead(id);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            setMarkingLoading(true);
            await notificationsService.markAllAsRead();
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Failed to update notifications');
        } finally {
            setMarkingLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Notifications</span>
                    {unreadCount > 0 && (
                        <button 
                            onClick={handleMarkAllRead}
                            disabled={markingLoading}
                            className="text-[9px] font-black uppercase text-primary hover:text-blue-600 flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                            {markingLoading ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-8 text-center flex items-center justify-center">
                            <Loader2 size={24} className="animate-spin text-slate-300" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Info size={24} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase">You&apos;re all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((n: any) => (
                            <div 
                                key={n.id} 
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${!n.isRead ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? 'bg-primary animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                    <div className="flex-1">
                                        <h5 className={`text-[11px] font-black uppercase tracking-tight mb-0.5 ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                            {n.title}
                                        </h5>
                                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                                            {n.message}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                                                {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {!n.isRead && (
                                                <button 
                                                    onClick={(e) => handleMarkAsRead(n.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black uppercase text-primary hover:underline"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-white dark:bg-slate-900 text-center">
                    <button className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest">
                        View all activity
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
