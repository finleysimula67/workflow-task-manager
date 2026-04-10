import { useState, useRef } from 'react';
import { Check, Trash2, Edit, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SwipeableTaskProps {
  children: React.ReactNode;
  onComplete?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isCompleted?: boolean;
}

export default function SwipeableTask({
  children,
  onComplete,
  onDelete,
  onEdit,
  isCompleted = false,
}: SwipeableTaskProps) {
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    if (diff < 0) {
      setTranslateX(Math.max(diff, -120));
    } else if (diff > 0 && translateX < 0) {
      setTranslateX(Math.min(0, diff + translateX));
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (translateX < -60) {
      setTranslateX(-120);
    } else {
      setTranslateX(0);
    }
  };

  const handleAction = (action: () => void) => {
    action();
    setTranslateX(0);
  };

  const resetSwipe = () => {
    setTranslateX(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl" ref={containerRef}>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <div className="flex h-full">
          {onComplete && (
            <button
              onClick={() => handleAction(onComplete)}
              className={`flex items-center justify-center w-16 h-full transition-colors ${
                isCompleted
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <Check size={20} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => handleAction(onEdit)}
              className="flex items-center justify-center w-14 h-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => handleAction(onDelete)}
              className="flex items-center justify-center w-14 h-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div
        className="relative bg-white dark:bg-slate-800 transition-transform duration-200"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-3 p-4">
          {children}
        </div>
        
        {translateX < 0 && (
          <button
            onClick={resetSwipe}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-slate-200 dark:bg-slate-700 rounded-full shadow-lg"
          >
            <ChevronRight size={16} className={isDark ? 'text-white' : 'text-slate-600'} />
          </button>
        )}
      </div>
    </div>
  );
}
