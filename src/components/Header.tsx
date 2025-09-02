import { Gem, Maximize, Minimize, XCircle, CheckCircle, Info, Keyboard } from 'lucide-react';
import { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Toast } from '../types';

type HeaderProps = {
  activeToast: Toast | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenShortcutsDialog: () => void;
  onOpenInfoDialog: () => void;
};

const ToastIcon = ({ type, ...props }: { type: Toast['type'] } & HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>
    {type === 'error' && <XCircle size={20} />}
    {type === 'success' && <CheckCircle size={20} />}
    {type === 'info' && <Info size={20} />}
  </div>
);

const toastColorClasses: Record<Toast['type'], string> = {
  error: 'text-red-500 dark:text-red-400',
  success: 'text-green-500 dark:text-green-400',
  info: 'text-gray-700 dark:text-gray-200',
};

export function Header({ activeToast, isFullscreen, onToggleFullscreen, onOpenShortcutsDialog, onOpenInfoDialog }: HeaderProps) {
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
    <header className="mb-3 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="h-8 w-8 flex-shrink-0 rounded bg-gradient-to-br from-red-600 to-red-800 ring-1 ring-red-900/40 flex items-center justify-center shadow-md">
          <Gem size={18} className="text-white" />
        </div>
        <div className="leading-tight select-none text-gray-800 dark:text-white">
          <h1 className="font-semibold tracking-tight">RubyPassport</h1>
          <p className="hidden sm:block text-[11px] text-red-600/80 dark:text-red-300/80">Passport Photo Generator</p>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Toast Container */}
        <div className="relative hidden h-[24px] w-80 overflow-hidden pr-2 mr-2 md:block">
          {displayedToast && (
            <div
              key={displayedToast.id}
              className={`absolute inset-0 flex items-center text-sm select-none transition-all duration-300 ease-in-out
                ${isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
                ${toastColorClasses[displayedToast.type]}`
              }
            >
              <ToastIcon type={displayedToast.type} className="mr-2 flex-shrink-0" />
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
        <button
          onClick={onOpenInfoDialog}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          title="Show info dialog (I)"
        >
          <Info size={20} />
        </button>
        <button
          onClick={onOpenShortcutsDialog}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          title="Show keyboard shortcuts (?)"
        >
          <Keyboard size={20} />
        </button>
      </div>
    </header>
  );
}