import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export default function PullToRefresh({ children, onRefresh, threshold = 80 }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRefreshing) return;
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      e.preventDefault();
      setPullDistance(Math.min(diff * 0.5, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(0);
      await onRefresh();
      setIsRefreshing(false);
    } else {
      setPullDistance(0);
    }
  };

  const pullPercentage = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className="min-h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex items-center justify-center transition-all duration-200 overflow-hidden ${
          isRefreshing || pullDistance > 0 ? 'h-16' : 'h-0'
        }`}
        style={{ opacity: pullPercentage }}
      >
        <div
          className={`flex flex-col items-center gap-1 ${
            'text-white'
          }`}
        >
          <RefreshCw
            size={24}
            className={`transition-transform duration-300 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ transform: `rotate(${pullDistance}deg)` }}
          />
          <span className="text-xs font-medium">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${isRefreshing ? 0 : pullDistance * 0.3}px)`,
        }}
        className="transition-transform duration-100"
      >
        {children}
      </div>
    </div>
  );
}
