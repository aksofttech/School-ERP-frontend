import { HTMLAttributes } from 'react';

// ✅ EXPORT THE INTERFACE
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

// ✅ DEFAULT EXPORT
export default function Skeleton({ className = '', ...props }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
            {...props}
        />
    );
}

// ✅ NAMED EXPORT (SSR SAFE)
export { Skeleton };
