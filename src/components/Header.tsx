import { Maximize, Minimize, Info, Keyboard } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

type HeaderProps = {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenShortcutsDialog: () => void;
  onOpenInfoDialog: () => void;
  isMobile?: boolean;
  isPWA?: boolean;
};

export function Header({ isFullscreen, onToggleFullscreen, onOpenShortcutsDialog, onOpenInfoDialog, isMobile, isPWA }: HeaderProps) {
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
        {!isPWA && (
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        )}
        <button
          onClick={onOpenInfoDialog}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600"
          title="Show info dialog (I)"
        >
          <Info size={20} />
        </button>
        {!isMobile && (
          <button
            onClick={onOpenShortcutsDialog}
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