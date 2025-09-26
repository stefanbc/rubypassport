import { Toolbar } from './Toolbar';
import { useTranslation } from 'react-i18next';

type HeaderProps = {
  onToggleFullscreen: () => void;
  onManageFormatsClick: () => void;
  selectedFormatLabel: string;
};

export function Header({ onToggleFullscreen, onManageFormatsClick, selectedFormatLabel }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="mb-3 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="h-8 w-8 sm:h-10 sm:w-10">
          <img src="/images/favicon.svg" alt={t('components.header.title')} className="w-full h-full object-contain" />
        </div>
        <div className="leading-tight select-none text-gray-800 dark:text-white">
          <h1 className="font-semibold tracking-tight text-lg">{t('components.header.title')}</h1>
          <p className="hidden sm:block text-xs text-red-600/80 dark:text-red-300/80">{t('components.header.subtitle')}</p>
        </div>
      </div>
      <Toolbar onToggleFullscreen={onToggleFullscreen} onManageFormatsClick={onManageFormatsClick} selectedFormatLabel={selectedFormatLabel} />
    </header>
  );
}