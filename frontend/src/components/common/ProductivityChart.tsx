import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  secondary?: number;
}

interface ProductivityChartProps {
  type: 'bar' | 'line' | 'donut';
  data: ChartData[];
  title?: string;
  showTrend?: boolean;
  trendValue?: number;
}

export default function ProductivityChart({
  type,
  data,
  title,
  showTrend,
  trendValue = 0,
}: ProductivityChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.secondary || 0)));
  const minValue = Math.min(...data.map(d => Math.min(d.value, d.secondary || 0)));

  const TrendIcon = trendValue > 0 ? TrendingUp : trendValue < 0 ? TrendingDown : Minus;
  const trendColor = trendValue > 0 ? 'text-green-500' : trendValue < 0 ? 'text-red-500' : isDark ? 'text-slate-400' : 'text-slate-500';

  if (type === 'donut') {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
    let cumulativePercentage = 0;

    return (
      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            {showTrend && (
              <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                <TrendIcon size={16} />
                <span>{Math.abs(trendValue)}%</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -cumulativePercentage;
                cumulativePercentage += percentage;
                
                return (
                  <circle
                    key={index}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
              <circle cx="18" cy="18" r="12" fill={isDark ? '#1e293b' : '#ffffff'} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {total}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            {showTrend && (
              <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                <TrendIcon size={16} />
                <span>{Math.abs(trendValue)}%</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-end justify-between gap-2 h-40">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                {item.secondary !== undefined && (
                  <div
                    className="w-full max-w-8 bg-purple-400 dark:bg-purple-500 rounded-t"
                    style={{ height: `${(item.secondary / maxValue) * 100}%` }}
                  />
                )}
                <div
                  className={`w-full max-w-8 rounded-t ${
                    isDark ? 'bg-blue-500' : 'bg-blue-500'
                  }`}
                  style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
                />
              </div>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {data[0]?.secondary !== undefined && (
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 dark:bg-purple-500 rounded" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Created</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          {showTrend && (
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              <TrendIcon size={16} />
              <span>{Math.abs(trendValue)}%</span>
            </div>
          )}
        </div>
      )}

      <div className="relative h-40">
        <svg className="w-full h-full" viewBox={`0 0 ${data.length * 40} 100`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#3b82f6' : '#3b82f6'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isDark ? '#3b82f6' : '#3b82f6'} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path
            d={`M 0 ${100 - (data[0].value / maxValue) * 100} ${data.map((item, index) => {
              const x = index * 40;
              const y = 100 - (item.value / maxValue) * 100;
              return `L ${x} ${y}`;
            }).join(' ')} L ${(data.length - 1) * 40} 100 L 0 100 Z`}
            fill="url(#lineGradient)"
          />
          
          <path
            d={`M 0 ${100 - (data[0].value / maxValue) * 100} ${data.map((item, index) => {
              const x = index * 40;
              const y = 100 - (item.value / maxValue) * 100;
              return `L ${x} ${y}`;
            }).join(' ')}`}
            fill="none"
            stroke={isDark ? '#3b82f6' : '#3b82f6'}
            strokeWidth="2"
            className="transition-all duration-500"
          />
          
          {data.map((item, index) => {
            const x = index * 40;
            const y = 100 - (item.value / maxValue) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={isDark ? '#1e293b' : '#ffffff'}
                stroke={isDark ? '#3b82f6' : '#3b82f6'}
                strokeWidth="2"
              />
            );
          })}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {data.map((item, index) => (
            <span key={index} className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
