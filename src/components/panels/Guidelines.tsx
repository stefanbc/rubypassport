import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Sun, ChevronDown } from 'lucide-react';
import { Footer } from '../Footer';
import { useStore } from '../../store';
import { useTranslation } from 'react-i18next';

export function Guidelines() {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useStore();
  const [openSections, setOpenSections] = useState({
    do: true,
    dont: true,
    lighting: true,
  });

  useEffect(() => {
    if (isMobile || isTablet) {
      setOpenSections({ do: true, dont: false, lighting: false });
    } else {
      setOpenSections({ do: true, dont: true, lighting: false });
    }
  }, [isMobile, isTablet]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 ${!isMobile && 'shadow-xl hover:shadow-2xl'}`}>
      <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-1 select-none">{t('components.panels.guidelines.title')}</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('components.panels.guidelines.subtitle')}</p>
      <div className="space-y-4 flex-grow flex flex-col overflow-y-auto pr-2">
        <div>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('do')} role="button" aria-expanded={openSections.do}>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500 dark:text-green-400" />
              <h4 className="font-medium text-gray-700 dark:text-gray-200">{t('components.panels.guidelines.do_title')}</h4>
            </div>
            <ChevronDown size={20} className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openSections.do ? 'rotate-180' : ''}`} />
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSections.do ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-1">
              <li>{t('components.panels.guidelines.do_item_1')}</li>
              <li>{t('components.panels.guidelines.do_item_2')}</li>
              <li>{t('components.panels.guidelines.do_item_3')}</li>
              <li>{t('components.panels.guidelines.do_item_4')}</li>
              <li>{t('components.panels.guidelines.do_item_5')}</li>
              <li>{t('components.panels.guidelines.do_item_6')}</li>
            </ul>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('dont')} role="button" aria-expanded={openSections.dont}>
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500 dark:text-red-400" />
              <h4 className="font-medium text-gray-700 dark:text-gray-200">{t('components.panels.guidelines.dont_title')}</h4>
            </div>
            <ChevronDown size={20} className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openSections.dont ? 'rotate-180' : ''}`} />
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSections.dont ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-1">
              <li>{t('components.panels.guidelines.dont_item_1')}</li>
              <li>{t('components.panels.guidelines.dont_item_2')}</li>
              <li>{t('components.panels.guidelines.dont_item_3')}</li>
              <li>{t('components.panels.guidelines.dont_item_4')}</li>
            </ul>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('lighting')} role="button" aria-expanded={openSections.lighting}>
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-yellow-500 dark:text-yellow-300" />
              <h4 className="font-medium text-gray-700 dark:text-gray-200">{t('components.panels.guidelines.lighting_title')}</h4>
            </div>
            <ChevronDown size={20} className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openSections.lighting ? 'rotate-180' : ''}`} />
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSections.lighting ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-1">
              <li>{t('components.panels.guidelines.lighting_item_1')}</li>
              <li>{t('components.panels.guidelines.lighting_item_2')}</li>
              <li>{t('components.panels.guidelines.lighting_item_3')}</li>
              <li>{t('components.panels.guidelines.lighting_item_4')}</li>
            </ul>
          </div>
        </div>

        <div className="flex-grow" />

        <div className="rounded-md bg-red-50 dark:bg-zinc-800/60 border border-red-100 dark:border-red-900/40 p-3">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{t('components.panels.guidelines.privacy_title')}</span><br />
            {t('components.panels.guidelines.privacy_body')}
          </p>
        </div>

        {isMobile && (
          <Footer />
        )}
      </div>
    </div>
  );
}