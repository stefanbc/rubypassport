import { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { XCircle, CheckCircle, Info } from 'lucide-react';
import { Toast } from '../types';

const ToastIcon = ({ type, ...props }: { type: Toast['type'] } & HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>
    {type === 'error' && <XCircle size={20} />}
    {type === 'success' && <CheckCircle size={20} />}
    {type === 'info' && <Info size={20} />}
  </div>
);

const toastColorClasses: Record<Toast['type'], string> = {
  error: 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/60 dark:border-red-800/50 dark:text-red-200',
  success: 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/60 dark:border-green-800/50 dark:text-green-200',
  info: 'bg-zinc-100 border-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200',
};

type ToastContainerProps = {
  activeToast: Toast | null;
};

export function ToastContainer({ activeToast }: ToastContainerProps) {
  const [displayedToast, setDisplayedToast] = useState<Toast | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const isAnimatingOut = useRef(false);

  // This effect orchestrates the exit and swapping of toasts
  useEffect(() => {
    if (isAnimatingOut.current) return;

    let timeoutId: number;

    if (activeToast && activeToast.id !== displayedToast?.id) {
      if (displayedToast) {
        isAnimatingOut.current = true;
        setIsToastVisible(false);
        timeoutId = window.setTimeout(() => {
          setDisplayedToast(activeToast);
          isAnimatingOut.current = false;
        }, 150); // Corresponds to transition duration
      } else {
        setDisplayedToast(activeToast);
      }
    } else if (!activeToast && displayedToast) {
      isAnimatingOut.current = true;
      setIsToastVisible(false);
      timeoutId = window.setTimeout(() => {
        setDisplayedToast(null);
        isAnimatingOut.current = false;
      }, 150);
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

  if (!displayedToast) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none">
      <div
        key={displayedToast.id}
        className={`flex items-center text-sm select-none transition-all duration-150 ease-in-out shadow-2xl rounded-lg p-3.5 border backdrop-blur-md
          ${isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}
          ${toastColorClasses[displayedToast.type]}`
        }
      >
        <ToastIcon type={displayedToast.type} className="mr-3 flex-shrink-0" />
        <span className="flex-1">{displayedToast.message}</span>
      </div>
    </div>
  );
}