import { XCircle, Keyboard } from 'lucide-react';

type ShortcutsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const shortcuts = [
  { key: '?', description: 'Show this help dialog' },
  { key: 'C', description: 'Start / Stop camera' },
  { key: 'Space', description: 'Capture photo' },
  { key: 'U', description: 'Import image' },
  { key: 'D', description: 'Download result' },
  { key: 'R', description: 'Retake photo' },
  { key: 'W', description: 'Toggle watermark' },
  { key: 'P', description: 'Open print options' },
  { key: 'F', description: 'Open format settings' },
  { key: 'T', description: 'Toggle theme' },
  { key: 'Enter', description: 'Toggle fullscreen' },
  { key: 'I', description: 'Show info dialog' },
];

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 sm:p-8 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600" aria-label="Close shortcuts dialog">
          <XCircle size={24} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Keyboard size={24} className="text-red-600 dark:text-red-400" />
          <h2 className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400 select-none">Keyboard Shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between"><span className="text-gray-700 dark:text-gray-300">{description}</span><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-zinc-800 dark:text-gray-100 dark:border-zinc-700">{key}</kbd></div>
          ))}
        </div>
      </div>
    </div>
  );
}