import { useState, useMemo } from 'react';
import { Plus, Zap, Sun } from 'lucide-react';
import { Task, FilterState } from '../types';
import { TaskCard } from '../components/TaskCard';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';

interface TodayPageProps {
  tasks: Task[];
  allTasks: Task[];
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
  sortBy: 'priority',
  sortDir: 'asc',
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TodayPage({ tasks, allTasks, onAdd, onEdit, onDelete, onToggle, getFiltered }: TodayPageProps) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const filtered = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayPending = allTasks.filter(t => !t.completed && t.dueDate === todayStr);
    const base = getFiltered({ ...filter });
    const todayIds = new Set(todayPending.map(t => t.id));
    return base.filter(t => todayIds.has(t.id));
  }, [allTasks, filter, getFiltered]);

  const completedToday = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return allTasks.filter(t => t.completed && t.completedAt?.slice(0, 10) === todayStr).length;
  }, [allTasks]);

  const total = tasks.length + completedToday;
  const progress = total === 0 ? 0 : Math.round((completedToday / total) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-charcoal-400 dark:text-charcoal-500 text-sm mb-1">
          <Sun size={14} />
          <span>{today}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white leading-tight">
              {getGreeting()}
            </h1>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">
              {tasks.length === 0
                ? "You're all caught up for today!"
                : `You have ${tasks.length} task${tasks.length !== 1 ? 's' : ''} due today`}
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
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="card p-4 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">Today's Progress</div>
              <div className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-0.5">
                {completedToday} of {total} tasks completed
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-500">{progress}%</div>
          </div>
          <div className="h-2 bg-charcoal-100 dark:bg-charcoal-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter */}
      <FilterBar filter={filter} onChange={updates => setFilter(f => ({ ...f, ...updates }))} />

      {/* Tasks */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Zap size={24} />}
          title={tasks.length === 0 ? "Nothing due today" : "No tasks match your filters"}
          description={
            tasks.length === 0
              ? "Great job! No tasks are due today. Add a task with today's due date to get started."
              : "Try adjusting your search or filters to find what you're looking for."
          }
          action={
            tasks.length === 0 && (
              <button onClick={onAdd} className="btn-primary text-sm flex items-center gap-1.5">
                <Plus size={14} />
                Add a task for today
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
