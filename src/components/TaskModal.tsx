import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Task, Priority, Category } from '../types';

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const priorities: Priority[] = ['low', 'medium', 'high'];
const categories: Category[] = ['work', 'personal', 'health', 'learning', 'finance', 'other'];

const priorityLabels: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };
const categoryLabels: Record<Category, string> = {
  work: 'Work', personal: 'Personal', health: 'Health',
  learning: 'Learning', finance: 'Finance', other: 'Other',
};

const priorityColors: Record<Priority, string> = {
  high: 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  medium: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  low: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
};

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium' as Priority,
  category: 'work' as Category,
  dueDate: '',
};

export function TaskModal({ open, task, onClose, onSave, onUpdate }: TaskModalProps) {
  const [form, setForm] = useState(defaultForm);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate || '',
        });
      } else {
        setForm(defaultForm);
      }
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, task]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const data = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      category: form.category,
      dueDate: form.dueDate || undefined,
    };

    if (task) {
      onUpdate(task.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-charcoal-850 rounded-t-3xl sm:rounded-2xl shadow-modal dark:shadow-modal-dark border border-charcoal-100/80 dark:border-charcoal-700/60 animate-slide-up z-10">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-charcoal-200 dark:bg-charcoal-700 rounded-full" />
        </div>

        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-charcoal-900 dark:text-white">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-charcoal-100 dark:hover:bg-charcoal-700 text-charcoal-400 dark:text-charcoal-500 hover:text-charcoal-600 dark:hover:text-charcoal-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <input
                ref={titleRef}
                type="text"
                placeholder="Task title..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="input w-full text-sm font-medium"
                required
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Add a description (optional)..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input w-full resize-none text-sm"
                rows={2}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {priorities.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all duration-150 ${
                      form.priority === p
                        ? priorityColors[p]
                        : 'border-charcoal-200 dark:border-charcoal-700 text-charcoal-500 dark:text-charcoal-500 hover:border-charcoal-300 dark:hover:border-charcoal-600'
                    }`}
                  >
                    {priorityLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {categories.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: c }))}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all duration-150 ${
                      form.category === c
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-charcoal-200 dark:border-charcoal-700 text-charcoal-500 dark:text-charcoal-500 hover:border-charcoal-300 dark:hover:border-charcoal-600'
                    }`}
                  >
                    {categoryLabels[c]}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="input w-full text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.title.trim()}
                className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {task ? (
                  'Save Changes'
                ) : (
                  <>
                    <Plus size={14} />
                    Add Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
