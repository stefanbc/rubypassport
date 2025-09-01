import { Gem, Maximize, Minimize, XCircle, CheckCircle, Info } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Toast } from '../types';

type HeaderProps = {
  toasts: Toast[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

export function Header({ toasts, isFullscreen, onToggleFullscreen }: HeaderProps) {
  const toastsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastsContainerRef.current) {
      toastsContainerRef.current.scrollTop = toastsContainerRef.current.scrollHeight;
    }
  }, [toasts]);

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
        {toasts.length > 0 && (
          <div
            ref={toastsContainerRef}
            className="max-h-[24px] space-y-2 overflow-y-auto pr-2 mr-2"
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`relative flex items-center text-sm transition-all duration-300 ease-in-out select-none ${toast.type === 'error' ? 'text-red-500 dark:text-red-600' : toast.type === 'success' ? 'text-green-500 dark:text-green-600' : 'text-gray-700 dark:text-gray-200'
                  }`}
              >
                <div className="mr-3">
                  {toast.type === 'error' && <XCircle size={20} />}
                  {toast.type === 'success' && <CheckCircle size={20} />}
                  {toast.type === 'info' && <Info size={20} />}
                </div>
                <span className="flex-1">{toast.message}</span>
              </div>
            ))}
          </div>
        )}
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