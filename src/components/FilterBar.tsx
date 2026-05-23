import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { FilterState, Category, Priority } from '../types';
import { useState } from 'react';

interface FilterBarProps {
  filter: FilterState;
  onChange: (f: Partial<FilterState>) => void;
}

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'health', label: 'Health' },
  { value: 'learning', label: 'Learning' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
];

const priorities: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export function FilterBar({ filter, onChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 dark:text-charcoal-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search}
            onChange={e => onChange({ search: e.target.value })}
            className="input w-full pl-8 text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
            showFilters || filter.category !== 'all' || filter.priority !== 'all'
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'border-charcoal-200 dark:border-charcoal-700 text-charcoal-500 dark:text-charcoal-400 hover:border-charcoal-300 dark:hover:border-charcoal-600 bg-charcoal-50 dark:bg-charcoal-800'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 animate-slide-up">
          {/* Category */}
          <div className="relative">
            <select
              value={filter.category}
              onChange={e => onChange({ category: e.target.value as Category | 'all' })}
              className="input w-full appearance-none pr-8 text-sm cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={filter.priority}
              onChange={e => onChange({ priority: e.target.value as Priority | 'all' })}
              className="input w-full appearance-none pr-8 text-sm cursor-pointer"
            >
              {priorities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={`${filter.sortBy}-${filter.sortDir}`}
              onChange={e => {
                const [sortBy, sortDir] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortDir']];
                onChange({ sortBy, sortDir });
              }}
              className="input w-full appearance-none pr-8 text-sm cursor-pointer"
            >
              {sortOptions.map(s => (
                <>
                  <option key={`${s.value}-asc`} value={`${s.value}-asc`}>{s.label} (A-Z)</option>
                  <option key={`${s.value}-desc`} value={`${s.value}-desc`}>{s.label} (Z-A)</option>
                </>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
