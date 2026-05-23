import { useState, useMemo } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { Task, FilterState } from '../types';
import { TaskCard } from '../components/TaskCard';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';

interface CompletedPageProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  getFiltered: (f: FilterState) => Task[];
}

const defaultFilter: FilterState = {
  search: '',
  category: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortDir: 'desc',
};

function groupByCompletedDate(tasks: Task[]): { label: string; tasks: Task[] }[] {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const groups: Map<string, Task[]> = new Map();

  for (const task of tasks) {
    const date = task.completedAt?.slice(0, 10) || 'unknown';
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(task);
  }

  const sorted = [...groups.keys()].sort((a, b) => b.localeCompare(a));
  return sorted.map(date => {
    let label: string;
    if (date === today) label = 'Today';
    else if (date === yesterday) label = 'Yesterday';
    else if (date === 'unknown') label = 'Unknown date';
    else {
      const d = new Date(date + 'T00:00:00');
      label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    return { label, tasks: groups.get(date)! };
  });
}

export function CompletedPage({ tasks, onEdit, onDelete, onToggle, getFiltered }: CompletedPageProps) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    const base = getFiltered({ ...filter });
    const completedIds = new Set(tasks.map(t => t.id));
    return base.filter(t => completedIds.has(t.id));
  }, [tasks, filter, getFiltered]);

  const grouped = useMemo(() => groupByCompletedDate(filtered), [filtered]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white leading-tight">Completed</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">
            {tasks.length} completed task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="flex-shrink-0">
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-500 dark:text-charcoal-400">Are you sure?</span>
                <button
                  onClick={() => {
                    tasks.forEach(t => onDelete(t.id));
                    setConfirmClear(false);
                  }}
                  className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Yes, clear all
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs font-medium text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-charcoal-400 dark:text-charcoal-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={13} />
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter */}
      <FilterBar filter={filter} onChange={updates => setFilter(f => ({ ...f, ...updates }))} />

      {/* Tasks */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 size={24} />}
          title={tasks.length === 0 ? "No completed tasks yet" : "No tasks match your filters"}
          description={
            tasks.length === 0
              ? "Complete your first task to see it here. Keep pushing!"
              : "Try adjusting your search or filters."
          }
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.label} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
                {group.label}
                <span className="ml-1 font-normal normal-case tracking-normal text-charcoal-400 dark:text-charcoal-600">
                  ({group.tasks.length})
                </span>
              </div>
              {group.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
