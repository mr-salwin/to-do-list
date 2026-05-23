import { useState, useCallback, useMemo } from 'react';
import { Task, Priority, Category, FilterState, Stats } from '../types';

const STORAGE_KEY = 'focusflow-tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  const updateTasks = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks(prev => {
      const next = updater(prev);
      saveTasks(next);
      return next;
    });
  }, []);

  const addTask = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    updateTasks(prev => [
      ...prev,
      {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        completed: false,
      },
    ]);
  }, [updateTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    updateTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, [updateTasks]);

  const deleteTask = useCallback((id: string) => {
    updateTasks(prev => prev.filter(t => t.id !== id));
  }, [updateTasks]);

  const toggleComplete = useCallback((id: string) => {
    updateTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  }, [updateTasks]);

  const stats = useMemo((): Stats => {
    const today = todayStr();
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const completedToday = tasks.filter(
      t => t.completed && t.completedAt?.slice(0, 10) === today
    ).length;

    const completedThisWeek = tasks.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      return new Date(t.completedAt) >= weekAgo;
    }).length;

    // Weekly data: last 7 days Sun-based
    const weeklyData = Array(7).fill(0);
    tasks.forEach(t => {
      if (!t.completed || !t.completedAt) return;
      const d = new Date(t.completedAt);
      if (d >= weekAgo) {
        const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
        const idx = 6 - diff;
        if (idx >= 0 && idx < 7) weeklyData[idx]++;
      }
    });

    // Streak: consecutive days with at least 1 completion
    let streak = 0;
    let checkDate = new Date(today);
    while (true) {
      const ds = checkDate.toISOString().slice(0, 10);
      const hasCompletion = tasks.some(
        t => t.completed && t.completedAt?.slice(0, 10) === ds
      );
      if (!hasCompletion) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const nonCompleted = tasks.filter(t => !t.completed).length;
    const total = tasks.length;
    const completionRate = total === 0 ? 0 : Math.round(((total - nonCompleted) / total) * 100);

    return {
      totalTasks: total,
      completedToday,
      completedThisWeek,
      streak,
      weeklyData,
      completionRate,
    };
  }, [tasks]);

  const getFilteredTasks = useCallback((filter: FilterState): Task[] => {
    let result = [...tasks];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (filter.category !== 'all') {
      result = result.filter(t => t.category === filter.category);
    }

    if (filter.priority !== 'all') {
      result = result.filter(t => t.priority === filter.priority);
    }

    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

    result.sort((a, b) => {
      let cmp = 0;
      switch (filter.sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) cmp = 0;
          else if (!a.dueDate) cmp = 1;
          else if (!b.dueDate) cmp = -1;
          else cmp = a.dueDate.localeCompare(b.dueDate);
          break;
        case 'priority':
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        default:
          cmp = a.createdAt.localeCompare(b.createdAt);
      }
      return filter.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks]);

  const todayTasks = useMemo(() => {
    const today = todayStr();
    return tasks.filter(t => !t.completed && t.dueDate === today);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const today = todayStr();
    return tasks.filter(t => !t.completed && (!t.dueDate || t.dueDate > today));
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter(t => t.completed);
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    stats,
    getFilteredTasks,
    todayTasks,
    upcomingTasks,
    completedTasks,
  };
}
