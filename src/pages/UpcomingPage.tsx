import { useState, useMemo } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { Task, FilterState } from '../types';
import { TaskCard } from '../components/TaskCard';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';

interface UpcomingPageProps {
  tasks: Task[];
  onAdd: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  getFiltered: (f: FilterState) => Task[];
}

const defaultFilter: FilterState = {
  search: '',
  category: 'all',
  priority: 'all',
  sortBy: 'dueDate',
  sortDir: 'asc',
};

function groupByDate(tasks: Task[]): { label: string; tasks: Task[]; overdue?: boolean }[] {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const groups: Map<string, Task[]> = new Map();
  const overdue: Task[] = [];
  const noDueDate: Task[] = [];

  for (const task of tasks) {
    if (!task.dueDate) {
      noDueDate.push(task);
      continue;
    }
    if (task.dueDate < today) {
      overdue.push(task);
      continue;
    }
    if (!groups.has(task.dueDate)) groups.set(task.dueDate, []);
    groups.get(task.dueDate)!.push(task);
  }

  const result: { label: string; tasks: Task[]; overdue?: boolean }[] = [];

  if (overdue.length > 0) {
    result.push({ label: 'Overdue', tasks: overdue, overdue: true });
  }

  const sortedDates = [...groups.keys()].sort();
  for (const date of sortedDates) {
    let label: string;
    if (date === today) label = 'Today';
    else if (date === tomorrow) label = 'Tomorrow';
    else {
      const d = new Date(date + 'T00:00:00');
      label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    result.push({ label, tasks: groups.get(date)! });
  }

  if (noDueDate.length > 0) {
    result.push({ label: 'No Due Date', tasks: noDueDate });
  }

  return result;
}

export function UpcomingPage({ tasks, onAdd, onEdit, onDelete, onToggle, getFiltered }: UpcomingPageProps) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  const filtered = useMemo(() => {
    const base = getFiltered({ ...filter });
    const pendingIds = new Set(tasks.map(t => t.id));
    return base.filter(t => pendingIds.has(t.id));
  }, [tasks, filter, getFiltered]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white leading-tight">Upcoming</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">
            {tasks.length} pending task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center gap-1.5 flex-shrink-0 text-sm"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filter */}
      <FilterBar filter={filter} onChange={updates => setFilter(f => ({ ...f, ...updates }))} />

      {/* Tasks */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar size={24} />}
          title={tasks.length === 0 ? "No pending tasks" : "No tasks match your filters"}
          description={
            tasks.length === 0
              ? "All tasks are completed or you haven't added any yet. Create your first task to get started."
              : "Try adjusting your search or filters."
          }
          action={
            tasks.length === 0 && (
              <button onClick={onAdd} className="btn-primary text-sm flex items-center gap-1.5">
                <Plus size={14} />
                Add your first task
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.label} className="space-y-2">
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                group.overdue
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-charcoal-400 dark:text-charcoal-500'
              }`}>
                {group.overdue && <AlertCircle size={12} />}
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
