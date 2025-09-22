import { Maximize, Minimize, Info, Keyboard, Images } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useStore } from '../store';
import { useShallow } from 'zustand/react/shallow';

type HeaderProps = {
  onToggleFullscreen: () => void;
};

export function Header({ onToggleFullscreen }: HeaderProps) {
  const {
    isFullscreen,
    isMobile,
    setActiveDialog,
    multiCaptureEnabled,
    setMultiCaptureEnabled,
    addToast,
    captureQueue,
  } = useStore(
    useShallow((state) => ({
      isFullscreen: state.isFullscreen,
      isMobile: state.isMobile,
      setActiveDialog: state.setActiveDialog,
      multiCaptureEnabled: state.multiCaptureEnabled,
      setMultiCaptureEnabled: state.setMultiCaptureEnabled,
      addToast: state.addToast,
      captureQueue: state.captureQueue,
    }))
  );

  const hasQueue = captureQueue.length > 0;

  return (
    <header className="mb-3 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="h-8 w-8 sm:h-10 sm:w-10">
          <img src="/images/favicon.svg" alt="Ruby Passport Logo" className="w-full h-full object-contain" />
        </div>
        <div className="leading-tight select-none text-gray-800 dark:text-white">
          <h1 className="font-semibold tracking-tight text-lg">Ruby Passport</h1>
          <p className="hidden sm:block text-xs text-red-600/80 dark:text-red-300/80">Passport Photo Generator</p>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeSwitcher />
        <button
          onClick={() => {
            if (hasQueue) {
              setActiveDialog('photoQueue');
            } else {
              const newState = !multiCaptureEnabled;
              setMultiCaptureEnabled(newState);
              addToast(
                newState
                  ? 'Photo Booth mode enabled - photos will be queued for batch printing'
                  : 'Photo Booth mode disabled - single photo mode',
                'info',
                2500
              );
            }
          }}
          className={`relative p-2 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600 ${multiCaptureEnabled || hasQueue
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}
          `}
          aria-pressed={multiCaptureEnabled}
          title={hasQueue ? `View Photo Queue (${captureQueue.length})` : (multiCaptureEnabled ? 'Photo Booth enabled' : 'Enable Photo Booth')}
        >
          <Images size={20} />
          {hasQueue && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-white text-[10px] font-bold ring-2 ring-gray-50 dark:ring-black">
              {captureQueue.length}
            </span>
          )}
        </button>
        {!isMobile && (
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        )}
        <button
          onClick={() => setActiveDialog('info')}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600"
          title="Show info dialog (I)"
        >
          <Info size={20} />
        </button>
        {!isMobile && (
          <button
            onClick={() => setActiveDialog('shortcuts')}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600"
            title="Show keyboard shortcuts (?)"
          >
            <Keyboard size={20} />
          </button>
        )}
      </div>
    </header>
  );
}