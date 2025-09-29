import { Keyboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../ui/Dialog';

type ShortcutsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
  const { t } = useTranslation();

  const shortcuts = [
    { key: '?', description: t('dialogs.shortcuts.items.show_help') },
    { key: 'C', description: t('dialogs.shortcuts.items.toggle_camera') },
    { key: 'Space', description: t('dialogs.shortcuts.items.capture') },
    { key: 'U', description: t('dialogs.shortcuts.items.import') },
    { key: 'D', description: t('dialogs.shortcuts.items.download') },
    { key: 'R', description: t('dialogs.shortcuts.items.retake') },
    { key: 'W', description: t('dialogs.shortcuts.items.toggle_watermark') },
    { key: 'P', description: t('dialogs.shortcuts.items.print') },
    { key: 'F', description: t('dialogs.shortcuts.items.format_settings') },
    { key: 'B', description: t('dialogs.shortcuts.items.toggle_photobooth') },
    { key: 'T', description: t('dialogs.shortcuts.items.toggle_theme') },
    { key: 'Enter', description: t('dialogs.shortcuts.items.toggle_fullscreen') },
    { key: 'I', description: t('dialogs.shortcuts.items.show_info') },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('dialogs.shortcuts.title')}
      icon={Keyboard}
      closeAriaLabel={t('dialogs.shortcuts.close_aria')}
    >
      <div className="overflow-y-auto p-6 sm:p-8 bg-white dark:bg-zinc-800/50 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between"><span className="text-gray-700 dark:text-gray-300">{description}</span><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-zinc-800 dark:text-gray-100 dark:border-zinc-700">{key}</kbd></div>
          ))}
      </div>
    </Dialog>
  );
}