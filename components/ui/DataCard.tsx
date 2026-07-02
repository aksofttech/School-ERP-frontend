import { ReactNode } from 'react';
import Skeleton from './Skeleton';
import { LucideIcon } from 'lucide-react';

interface DataCardProps {
    title: string;
    value?: string | number;
    icon?: LucideIcon;
    trend?: {
        value: string | number;
        label?: string;
        isPositive?: boolean;
    };
    isLoading?: boolean;
    error?: string | null;
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

const colorMap = {
    primary: 'bg-blue-50 text-blue-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
    info: 'bg-sky-50 text-sky-600',
};

export default function DataCard({
    title,
    value,
    icon: Icon,
    trend,
    isLoading,
    error,
    color = 'primary',
    className = '',
}: DataCardProps) {
    if (error) {
        return (
            <div className={`bg-white border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[140px] shadow-sm ${className}`}>
                <span className="text-red-500 mb-2">⚠</span>
                <p className="text-sm font-medium text-red-600">Failed to load data</p>
            </div>
        );
    }

    return (
        <div className={`
            bg-white rounded-lg p-6 
            border border-slate-200 shadow-sm
            transition-all duration-200
            ${className}
        `}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    {isLoading ? (
                        <Skeleton className="h-8 w-24 mt-2 bg-slate-100" />
                    ) : (
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">
                            {value ?? '0'}
                        </h3>
                    )}
                </div>
                {Icon && (
                    <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
                        <Icon size={20} />
                    </div>
                )}
            </div>

            {/* Bottom Section: Trend or Footer */}
            {(trend && !isLoading) && (
                <div className="flex items-center gap-2 mt-2">
                    <div className={`
                        flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold
                        ${trend.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}
                    `}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        {trend.value}
                    </div>
                    {trend.label && <span className="text-xs text-slate-500">{trend.label}</span>}
                </div>
            )}

            {isLoading && <Skeleton className="h-4 w-32 mt-2 bg-slate-100" />}
        </div>
    );
}
