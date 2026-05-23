export type Priority = 'low' | 'medium' | 'high';

export type Category =
  | 'work'
  | 'personal'
  | 'health'
  | 'learning'
  | 'finance'
  | 'other';

export type View =
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'stats';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO datetime string
  completedAt?: string;
}

export interface FilterState {
  search: string;
  category: Category | 'all';
  priority: Priority | 'all';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortDir: 'asc' | 'desc';
}

export interface Stats {
  totalTasks: number;
  completedToday: number;
  completedThisWeek: number;
  streak: number;
  weeklyData: number[]; // 7 values, Sun-Sat completion counts
  completionRate: number; // 0-100
}
