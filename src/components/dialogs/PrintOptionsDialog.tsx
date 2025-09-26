import { XCircle, Printer } from 'lucide-react';
import { PhotoCount, PHOTO_COUNTS, FORMATS } from '../../types';
import { useStore } from '../../store';
import { useTranslation } from 'react-i18next';

type PrintOptionsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onPrint: () => void;
};

export function PrintOptionsDialog({
    isOpen,
    onClose,
    onPrint,
}: PrintOptionsDialogProps) {
    const { photosPerPage, setPhotosPerPage, selectedFormatId, customFormats } = useStore();
    const { t } = useTranslation();
    const allFormats = [...FORMATS, ...customFormats];
    const selectedFormat = allFormats.find(f => f.id === selectedFormatId) || FORMATS[0];

    if (!isOpen) return null;

    const handlePrint = () => {
        onPrint();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-md flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
                    <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3">
                        <Printer size={24} />
                        {t('dialogs.print.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full"
                        aria-label={t('dialogs.print.close_aria')}
                    >
                        <XCircle size={22} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-800/50">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-40 select-none" htmlFor="photosPerPageDialog">{t('dialogs.print.photos_per_page_label')}</label>
                            <select
                                id="photosPerPageDialog"
                                value={photosPerPage}
                                onChange={(e) => setPhotosPerPage(Number(e.target.value) as PhotoCount)}
                                className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40"
                            >
                                {PHOTO_COUNTS.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('dialogs.print.description', { width: selectedFormat.printWidthIn.toFixed(2), height: selectedFormat.printHeightIn.toFixed(2) })}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-8">
                        <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer">
                            {t('dialogs.print.cancel_button')}
                        </button>
                        <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer">
                            <Printer size={18} />
                            {t('dialogs.print.print_now_button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}