import { ReactNode } from 'react';
import Skeleton from './Skeleton';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        onPageChange: (page: number) => void;
    };
    className?: string;
}

export default function DataTable<T>({
    data,
    columns,
    isLoading,
    onRowClick,
    emptyMessage = 'No data found.',
    pagination,
    className = '',
}: DataTableProps<T>) {
    return (
        <div className={`flex flex-col ${className}`}>
            <div className="overflow-hidden border border-slate-200 rounded-lg bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((column, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${column.className || ''}`}
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <Skeleton className="h-4 w-full bg-slate-100" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="p-3 bg-slate-50 rounded-full">
                                            <Inbox size={24} className="text-slate-400" />
                                        </div>
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, i) => (
                                <tr
                                    key={i}
                                    onClick={() => onRowClick?.(item)}
                                    className={`
                                        group transition-colors duration-150
                                        ${onRowClick
                                            ? 'cursor-pointer hover:bg-slate-50'
                                            : 'hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    {columns.map((column, j) => (
                                        <td key={j} className={`px-6 py-4 text-sm text-slate-700 ${column.className || ''}`}>
                                            {typeof column.accessor === 'function' ? column.accessor(item) : (item[column.accessor] as ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-1">
                    <p className="text-xs text-slate-500">
                        Showing <span className="font-medium text-slate-900">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-slate-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-slate-900">{pagination.total}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1 || isLoading}
                            className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => pagination.onPageChange(i + 1)}
                                    className={`
                                        h-8 w-8 rounded-md text-xs font-medium transition-colors
                                        ${pagination.page === i + 1
                                            ? 'bg-blue-600 text-white border border-blue-600'
                                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit) || isLoading}
                            className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
