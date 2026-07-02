import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'indigo' | 'purple' | 'orange' | 'emerald';
}

export default function StatCard({
  title,
  value,
  icon,
  className = '',
  trend,
  trendType = 'up',
  color = 'indigo'
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-primary dark:text-indigo-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className={`bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${trendType === 'up'
              ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
              : trendType === 'down'
                ? 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                : 'text-gray-600 bg-gray-100 dark:bg-gray-800'
            }`}>
            {trendType === 'up' ? <TrendingUp size={12} /> : trendType === 'down' ? <TrendingDown size={12} /> : null}
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{title}</p>
    </div>
  );
}
