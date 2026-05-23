import { Flame, TrendingUp, Target, CheckCircle2, Calendar, Award } from 'lucide-react';
import { Stats, Task } from '../types';

interface StatsPageProps {
  stats: Stats;
  tasks: Task[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="card p-5 flex items-start gap-4 animate-scale-in">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">{label}</div>
        <div className="text-2xl font-bold text-charcoal-900 dark:text-white mt-0.5 leading-none">{value}</div>
        {sub && <div className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function WeekBar({ day, count, max }: { day: string; count: number; max: number }) {
  const pct = max === 0 ? 0 : (count / max) * 100;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const isToday = day === today;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-xs font-medium text-charcoal-700 dark:text-charcoal-300">{count || ''}</div>
      <div className="w-8 h-20 bg-charcoal-100 dark:bg-charcoal-700/60 rounded-lg overflow-hidden flex items-end">
        <div
          className={`w-full rounded-lg transition-all duration-700 ease-out ${
            isToday ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-600/70'
          }`}
          style={{ height: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
        />
      </div>
      <div className={`text-xs font-medium ${isToday ? 'text-blue-500 dark:text-blue-400' : 'text-charcoal-400 dark:text-charcoal-500'}`}>
        {day}
      </div>
    </div>
  );
}

function CategoryBreakdown({ tasks }: { tasks: Task[] }) {
  const counts: Record<string, number> = {};
  tasks.forEach(t => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });

  const total = tasks.length;
  if (total === 0) return null;

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const categoryColors: Record<string, string> = {
    work: 'bg-blue-400 dark:bg-blue-500',
    personal: 'bg-violet-400 dark:bg-violet-500',
    health: 'bg-green-400 dark:bg-green-500',
    learning: 'bg-cyan-400 dark:bg-cyan-500',
    finance: 'bg-orange-400 dark:bg-orange-500',
    other: 'bg-charcoal-400 dark:bg-charcoal-500',
  };

  const categoryLabels: Record<string, string> = {
    work: 'Work', personal: 'Personal', health: 'Health',
    learning: 'Learning', finance: 'Finance', other: 'Other',
  };

  return (
    <div className="space-y-2.5">
      {sorted.map(([cat, count]) => (
        <div key={cat} className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${categoryColors[cat] || 'bg-charcoal-400'}`} />
          <div className="flex-1 text-sm text-charcoal-700 dark:text-charcoal-300 font-medium">
            {categoryLabels[cat] || cat}
          </div>
          <div className="text-xs text-charcoal-400 dark:text-charcoal-500 w-8 text-right">{count}</div>
          <div className="w-24 h-1.5 bg-charcoal-100 dark:bg-charcoal-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${categoryColors[cat] || 'bg-charcoal-400'}`}
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsPage({ stats, tasks }: StatsPageProps) {
  const pendingTasks = tasks.filter(t => !t.completed);
  const highPriority = pendingTasks.filter(t => t.priority === 'high').length;

  // Build weekly data using day labels
  const today = new Date();
  const weeklyWithLabels = stats.weeklyData.map((count, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return { day: DAY_LABELS[d.getDay()], count };
  });
  const maxCount = Math.max(...stats.weeklyData, 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white leading-tight">Stats</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">Your productivity overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={<Flame size={18} className="text-orange-500" />}
          label="Day Streak"
          value={stats.streak}
          sub={stats.streak === 1 ? '1 day in a row' : stats.streak === 0 ? 'Start today!' : `${stats.streak} days in a row`}
          color="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatCard
          icon={<CheckCircle2 size={18} className="text-blue-500" />}
          label="Completed Today"
          value={stats.completedToday}
          sub="tasks done today"
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="This Week"
          value={stats.completedThisWeek}
          sub="completed past 7 days"
          color="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={<Target size={18} className="text-red-500" />}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          sub="of all tasks done"
          color="bg-red-100 dark:bg-red-900/30"
        />
        <StatCard
          icon={<Calendar size={18} className="text-cyan-500" />}
          label="Total Tasks"
          value={stats.totalTasks}
          sub={`${pendingTasks.length} pending`}
          color="bg-cyan-100 dark:bg-cyan-900/30"
        />
        <StatCard
          icon={<Award size={18} className="text-amber-500" />}
          label="High Priority"
          value={highPriority}
          sub="tasks need attention"
          color="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* Completion Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300">Overall Completion</h2>
          <span className="text-sm font-bold text-blue-500">{stats.completionRate}%</span>
        </div>
        <div className="h-3 bg-charcoal-100 dark:bg-charcoal-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-charcoal-400 dark:text-charcoal-500 mt-2">
          <span>{stats.totalTasks - pendingTasks.length} completed</span>
          <span>{pendingTasks.length} remaining</span>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-5">Weekly Consistency</h2>
        <div className="flex items-end justify-between gap-1">
          {weeklyWithLabels.map(({ day, count }, i) => (
            <WeekBar key={i} day={day} count={count} max={maxCount} />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-charcoal-100 dark:border-charcoal-800 flex items-center justify-between text-xs text-charcoal-400 dark:text-charcoal-500">
          <span>Tasks completed per day</span>
          <span className="text-blue-500 dark:text-blue-400 font-medium">Last 7 days</span>
        </div>
      </div>

      {/* Category Breakdown */}
      {tasks.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-4">Category Breakdown</h2>
          <CategoryBreakdown tasks={tasks} />
        </div>
      )}

      {/* Streak card */}
      {stats.streak > 0 && (
        <div className="card p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-orange-100 dark:border-orange-800/30 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔥</div>
            <div>
              <div className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                {stats.streak} day streak!
              </div>
              <div className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-0.5">
                Keep completing tasks daily to maintain your streak.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
