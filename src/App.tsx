import { useState, useCallback } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { useTasks } from './hooks/useTasks';
import { Sidebar } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { TodayPage } from './pages/TodayPage';
import { UpcomingPage } from './pages/UpcomingPage';
import { CompletedPage } from './pages/CompletedPage';
import { StatsPage } from './pages/StatsPage';
import { View, Task } from './types';

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const {
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
  } = useTasks();

  const [view, setView] = useState<View>('today');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const openAdd = useCallback(() => {
    setEditTask(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditTask(null);
  }, []);

  const taskCounts = {
    today: todayTasks.length,
    upcoming: upcomingTasks.length,
    completed: completedTasks.length,
  };

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-950 transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          activeView={view}
          onViewChange={setView}
          isDark={isDark}
          onToggleDark={toggleDark}
          taskCounts={taskCounts}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pt-20 lg:pt-8 pb-16">
            {view === 'today' && (
              <TodayPage
                key="today"
                tasks={todayTasks}
                allTasks={tasks}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                getFiltered={getFilteredTasks}
              />
            )}
            {view === 'upcoming' && (
              <UpcomingPage
                key="upcoming"
                tasks={upcomingTasks}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                getFiltered={getFilteredTasks}
              />
            )}
            {view === 'completed' && (
              <CompletedPage
                key="completed"
                tasks={completedTasks}
                onEdit={openEdit}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                getFiltered={getFilteredTasks}
              />
            )}
            {view === 'stats' && (
              <StatsPage
                key="stats"
                stats={stats}
                tasks={tasks}
              />
            )}
          </div>
        </main>
      </div>

      <TaskModal
        open={modalOpen}
        task={editTask}
        onClose={closeModal}
        onSave={addTask}
        onUpdate={updateTask}
      />
    </div>
  );
}
