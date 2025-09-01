import { Gem, Maximize, Minimize, XCircle, CheckCircle, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Toast } from '../types';

type HeaderProps = {
  activeToast: Toast | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

export function Header({ activeToast, isFullscreen, onToggleFullscreen }: HeaderProps) {
  const [displayedToast, setDisplayedToast] = useState<Toast | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const isAnimatingOut = useRef(false);

  // This effect orchestrates the exit and swapping of toasts
  useEffect(() => {
    if (isAnimatingOut.current) {
      return;
    }

    let timeoutId: number;

    if (activeToast && activeToast.id !== displayedToast?.id) {
      if (displayedToast) {
        isAnimatingOut.current = true;
        setIsToastVisible(false);
        timeoutId = window.setTimeout(() => {
          setDisplayedToast(activeToast);
          isAnimatingOut.current = false;
        }, 300); // Corresponds to transition duration
      } else {
        setDisplayedToast(activeToast);
      }
    } else if (!activeToast && displayedToast) {
      isAnimatingOut.current = true;
      setIsToastVisible(false);
      timeoutId = window.setTimeout(() => {
        setDisplayedToast(null);
        isAnimatingOut.current = false;
      }, 300);
    }

    return () => clearTimeout(timeoutId);
  }, [activeToast, displayedToast]);

  // This effect handles the "in" animation
  useEffect(() => {
    if (displayedToast) {
      const timer = window.setTimeout(() => setIsToastVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [displayedToast]);

  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-gradient-to-br from-red-600 to-red-800 ring-1 ring-red-900/40 flex items-center justify-center shadow-md">
          <Gem size={18} className="text-white" />
        </div>
        <div className="leading-tight select-none text-gray-800 dark:text-white">
          <div className="font-semibold tracking-tight">RubyPassport</div>
          <div className="text-[11px] text-red-600/80 dark:text-red-300/80">Passport Photo Generator</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Toast Container */}
        <div className="relative h-[24px] w-80 overflow-hidden pr-2 mr-2">
          {displayedToast && (
            <div
              key={displayedToast.id}
              className={`absolute inset-0 flex items-center text-sm select-none transition-all duration-300 ease-in-out
                ${isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
                ${displayedToast.type === 'error' ? 'text-red-500 dark:text-red-600' : displayedToast.type === 'success' ? 'text-green-500 dark:text-green-600' : 'text-gray-700 dark:text-gray-200'
                }`
              }
            >
              <div className="mr-3">
                {displayedToast.type === 'error' && <XCircle size={20} />}
                {displayedToast.type === 'success' && <CheckCircle size={20} />}
                {displayedToast.type === 'info' && <Info size={20} />}
              </div>
              <span className="flex-1 truncate">{displayedToast.message}</span>
            </div>
          )}
        </div>
        <ThemeSwitcher />
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
    </div>
  );
}