import { Flame, Trophy, Calendar, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TaskStreaksProps {
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export default function TaskStreaks({
  currentStreak,
  longestStreak,
  tasksCompletedToday,
  weeklyGoal,
  weeklyProgress,
}: TaskStreaksProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const isGoalReached = weeklyProgress >= weeklyGoal;

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Your Progress
        </h3>
        <div className="flex items-center gap-1.5">
          <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <span className={`font-bold ${currentStreak > 0 ? 'text-orange-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentStreak} day{currentStreak !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Best Streak</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {longestStreak} days
          </p>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Today</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {tasksCompletedToday} task{tasksCompletedToday !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Weekly Goal
          </span>
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {weeklyProgress} / {weeklyGoal}
          </span>
        </div>
        
        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {isGoalReached && (
          <div className="flex items-center gap-2 mt-3 text-green-500">
            <Trophy size={16} />
            <span className="text-sm font-medium">Goal reached! Great job!</span>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        {days.map((day, index) => {
          const isCompleted = index < adjustedToday && weeklyProgress >= (index + 1) * (weeklyGoal / 5);
          const isToday = index === adjustedToday;
          
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                isToday
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-600'
                  : isCompleted
                    ? 'bg-green-500 text-white'
                    : isDark
                      ? 'bg-slate-700 text-slate-500'
                      : 'bg-slate-200 text-slate-400'
              }`}>
                {day}
              </div>
              {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
