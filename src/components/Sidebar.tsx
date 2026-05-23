import { Sun, Moon, CheckSquare, Calendar, CheckCircle2, BarChart3, Zap, Menu, X } from 'lucide-react';
import { View } from '../types';
import { useState } from 'react';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  isDark: boolean;
  onToggleDark: () => void;
  taskCounts: { today: number; upcoming: number; completed: number };
}

const navItems: { id: View; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'today', label: "Today", icon: <Zap size={18} />, description: "Due today" },
  { id: 'upcoming', label: "Upcoming", icon: <Calendar size={18} />, description: "All pending" },
  { id: 'completed', label: "Completed", icon: <CheckCircle2 size={18} />, description: "Done tasks" },
  { id: 'stats', label: "Stats", icon: <BarChart3 size={18} />, description: "Your progress" },
];

export function Sidebar({ activeView, onViewChange, isDark, onToggleDark, taskCounts }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const counts: Record<View, number | undefined> = {
    today: taskCounts.today,
    upcoming: taskCounts.upcoming,
    completed: taskCounts.completed,
    stats: undefined,
  };

  const handleNav = (view: View) => {
    onViewChange(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-charcoal-100 dark:border-charcoal-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <CheckSquare size={14} className="text-white" />
          </div>
          <span className="font-semibold text-charcoal-900 dark:text-white text-sm">FocusFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg hover:bg-charcoal-100 dark:hover:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-charcoal-100 dark:hover:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 transition-colors"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-[57px] left-0 bottom-0 z-40 w-64 bg-white dark:bg-charcoal-900 border-r border-charcoal-100 dark:border-charcoal-800 p-4 animate-slide-in-right">
          <SidebarContent activeView={activeView} onNav={handleNav} counts={counts} isDark={isDark} onToggleDark={onToggleDark} mobile />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 h-screen sticky top-0 border-r border-charcoal-100 dark:border-charcoal-800 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md p-4">
        <SidebarContent activeView={activeView} onNav={handleNav} counts={counts} isDark={isDark} onToggleDark={onToggleDark} />
      </aside>
    </>
  );
}

function SidebarContent({
  activeView,
  onNav,
  counts,
  isDark,
  onToggleDark,
  mobile = false,
}: {
  activeView: View;
  onNav: (v: View) => void;
  counts: Record<View, number | undefined>;
  isDark: boolean;
  onToggleDark: () => void;
  mobile?: boolean;
}) {
  return (
    <>
      {!mobile && (
        <div className="flex items-center gap-3 px-1 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <CheckSquare size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-charcoal-900 dark:text-white text-sm leading-none">FocusFlow</div>
            <div className="text-[10px] text-charcoal-400 dark:text-charcoal-500 mt-0.5 leading-none">Productivity Suite</div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-charcoal-400 dark:text-charcoal-600 px-3 mb-2">
          Workspace
        </div>
        {navItems.map(item => {
          const active = activeView === item.id;
          const count = counts[item.id];
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`sidebar-item w-full group ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
            >
              <span className={`flex-shrink-0 transition-colors ${active ? 'text-blue-500 dark:text-blue-400' : 'text-charcoal-400 dark:text-charcoal-500 group-hover:text-charcoal-600 dark:group-hover:text-charcoal-300'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {count !== undefined && count > 0 && (
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                  active
                    ? 'bg-blue-500/15 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400'
                    : 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-charcoal-100 dark:border-charcoal-800 pt-4 mt-4">
        <button
          onClick={onToggleDark}
          className="sidebar-item sidebar-item-inactive w-full group"
        >
          <span className="text-charcoal-400 dark:text-charcoal-500 group-hover:text-charcoal-600 dark:group-hover:text-charcoal-300 transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </span>
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </>
  );
}
