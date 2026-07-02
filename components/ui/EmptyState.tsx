/**
 * EmptyState Component
 * Displays an empty state message with optional icon and action
 */

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title, 
  message, 
  icon, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
      <p className="text-gray-500 mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
