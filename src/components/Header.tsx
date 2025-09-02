import { Gem, Maximize, Minimize, Info, Keyboard } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

type HeaderProps = {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenShortcutsDialog: () => void;
  onOpenInfoDialog: () => void;
};

export function Header({ isFullscreen, onToggleFullscreen, onOpenShortcutsDialog, onOpenInfoDialog }: HeaderProps) {
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