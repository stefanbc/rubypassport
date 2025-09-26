import { useState } from 'react';
import { XCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type InfoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();
  const faqs: { q: string, a: string }[] = t('dialogs.info.faqs', { returnObjects: true }) as { q: string, a: string }[];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3">
            <HelpCircle size={24} />
            {t('dialogs.info.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full"
            aria-label={t('dialogs.info.close_aria')}
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-white dark:bg-zinc-800/50">
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isFaqOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-red-100 dark:border-red-900/30 last:border-b-0">
                  <div
                    className="flex items-center justify-between cursor-pointer py-3"
                    onClick={() => toggleFaq(index)}
                    role="button"
                    aria-expanded={isFaqOpen}
                  >
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 pr-4">{faq.q}</h3>
                    <ChevronDown size={20} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isFaqOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${isFaqOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pb-4 pr-6">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}