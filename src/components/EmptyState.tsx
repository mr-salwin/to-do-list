import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center text-charcoal-400 dark:text-charcoal-600 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1">{title}</h3>
      <p className="text-xs text-charcoal-400 dark:text-charcoal-600 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
