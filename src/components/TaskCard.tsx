import { Check, Pencil, Trash2, Calendar, Flag, Tag, Clock } from 'lucide-react';
import { Task, Priority, Category } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; className: string; dot: string }> = {
  high: { label: 'High', className: 'priority-high', dot: 'bg-red-500' },
  medium: { label: 'Medium', className: 'priority-medium', dot: 'bg-amber-500' },
  low: { label: 'Low', className: 'priority-low', dot: 'bg-emerald-500' },
};

const categoryConfig: Record<Category, { label: string; color: string }> = {
  work: { label: 'Work', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  personal: { label: 'Personal', color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20' },
  health: { label: 'Health', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  learning: { label: 'Learning', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' },
  finance: { label: 'Finance', color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' },
  other: { label: 'Other', color: 'text-charcoal-600 dark:text-charcoal-400 bg-charcoal-100 dark:bg-charcoal-700/40' },
};

function formatDueDate(dueDate: string): { label: string; urgent: boolean; overdue: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  if (dueDate < today) return { label: 'Overdue', urgent: true, overdue: true };
  if (dueDate === today) return { label: 'Today', urgent: true, overdue: false };
  if (dueDate === tomorrow) return { label: 'Tomorrow', urgent: false, overdue: false };

  const d = new Date(dueDate + 'T00:00:00');
  return {
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    urgent: false,
    overdue: false,
  };
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const category = categoryConfig[task.category];
  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <div
      className={`group card p-4 transition-all duration-200 hover:shadow-md dark:hover:shadow-black/20 hover:-translate-y-0.5 animate-slide-up ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-blue-500 border-blue-500 scale-95'
              : 'border-charcoal-300 dark:border-charcoal-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-medium leading-snug transition-colors ${
                task.completed
                  ? 'line-through text-charcoal-400 dark:text-charcoal-600'
                  : 'text-charcoal-900 dark:text-charcoal-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg hover:bg-charcoal-100 dark:hover:bg-charcoal-700 text-charcoal-400 dark:text-charcoal-500 hover:text-charcoal-600 dark:hover:text-charcoal-300 transition-colors"
                title="Edit task"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-charcoal-400 dark:text-charcoal-500 hover:text-red-500 transition-colors"
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-charcoal-500 dark:text-charcoal-500 mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
            <span className={`badge ${priority.className} gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            <span className={`badge gap-1 ${category.color}`}>
              <Tag size={10} />
              {category.label}
            </span>

            {dueDateInfo && (
              <span
                className={`badge gap-1 ${
                  dueDateInfo.overdue
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : dueDateInfo.urgent
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-charcoal-100 dark:bg-charcoal-700/60 text-charcoal-500 dark:text-charcoal-400'
                }`}
              >
                {dueDateInfo.overdue ? <Clock size={10} /> : <Calendar size={10} />}
                {dueDateInfo.label}
              </span>
            )}

            {task.completed && task.completedAt && (
              <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 gap-1">
                <Check size={10} strokeWidth={3} />
                Done
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
