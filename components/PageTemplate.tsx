/**
 * Generic Page Template
 * Reusable template for creating standard pages
 */

import { ReactNode } from 'react';

interface PageTemplateProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  error?: string;
}

export default function PageTemplate({ title, children, loading, error }: PageTemplateProps) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {children}
    </div>
  );
}
