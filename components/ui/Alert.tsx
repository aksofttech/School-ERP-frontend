/**
 * Alert Component
 */

import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export default function Alert({ children, type = 'info', className = '' }: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 border-green-400 text-green-700',
    error: 'bg-red-50 border-red-400 text-red-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
  };
  
  return (
    <div className={`border px-4 py-3 rounded ${typeClasses[type]} ${className}`}>
      {children}
    </div>
  );
}
