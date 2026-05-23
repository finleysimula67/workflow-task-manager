import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
}

interface CalendarViewProps {
  tasks: Task[];
  onSelectDate: (date: string) => void;
  onSelectTask?: (task: Task) => void;
}

export default function CalendarView({ tasks, onSelectDate, onSelectTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.dueDate?.startsWith(date));
  };

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleDateClick = (day: number) => {
    const date = formatDate(day);
    setSelectedDate(date);
    onSelectDate(date);
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 sm:h-12" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day);
      const tasksForDay = getTasksForDate(dateStr);
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedDate;
      const isPast = new Date(dateStr) < new Date(todayStr) && !isToday;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`relative h-10 sm:h-12 flex flex-col items-center justify-center rounded-lg transition-all ${
            isSelected
              ? 'bg-white/20 text-white'
              : isToday
                ? 'ring-2 ring-white/30'
                : isPast
                  ? isDark
                    ? 'text-slate-600'
                    : 'text-slate-300'
                  : isDark
                    ? 'text-slate-200 hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {tasksForDay.length > 0 && (
            <div className="absolute bottom-1 flex gap-0.5">
              {tasksForDay.slice(0, 3).map((task, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected
                      ? 'bg-white'
                      : task.priority === 'URGENT'
                        ? 'bg-red-500'
                        : task.priority === 'HIGH'
                          ? 'bg-orange-500'
                          : task.priority === 'MEDIUM'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={prevMonth}
          className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {monthNames[month]} {year}
        </h3>
        
        <button
          onClick={nextMonth}
          className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className={`text-center text-xs font-medium py-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>

      {selectedDate && (
        <div className={`p-4 border-t ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </h4>
          
          {selectedTasks.length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No tasks scheduled for this day
            </p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => onSelectTask?.(task)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      task.priority === 'URGENT' ? 'bg-red-500' :
                      task.priority === 'HIGH' ? 'bg-orange-500' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`text-xs ml-4 ${
                    task.status === 'COMPLETED' ? 'text-green-500' :
                    task.status === 'IN_PROGRESS' ? 'text-white' :
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {task.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
