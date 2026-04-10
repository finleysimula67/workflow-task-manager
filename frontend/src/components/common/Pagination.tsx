import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showPageNumbers?: boolean;
  maxVisible?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showPageNumbers = true,
  maxVisible = 5,
}: PaginationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > maxVisible - 1) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages - 1, start + maxVisible - 3);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - maxVisible + 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startItem = totalItems ? (currentPage - 1) * (itemsPerPage || 10) + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * (itemsPerPage || 10), totalItems) : 0;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl ${
      isDark ? 'bg-slate-800/50' : 'bg-white'
    }`}>
      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {totalItems ? (
          <span>
            Showing {startItem} to {endItem} of {totalItems} tasks
          </span>
        ) : (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`hidden sm:flex p-2 rounded-lg transition ${
            currentPage === 1
              ? isDark
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 cursor-not-allowed'
              : isDark
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition ${
            currentPage === 1
              ? isDark
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 cursor-not-allowed'
              : isDark
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition ${
                    page === currentPage
                      ? 'bg-blue-500 text-white'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={index}
                  className={`min-w-[36px] h-9 flex items-center justify-center ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {page}
                </span>
              )
            ))}
          </div>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition ${
            currentPage === totalPages
              ? isDark
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 cursor-not-allowed'
              : isDark
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`hidden sm:flex p-2 rounded-lg transition ${
            currentPage === totalPages
              ? isDark
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 cursor-not-allowed'
              : isDark
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
