import { XCircle, Printer } from 'lucide-react';
import { PhotoCount, PHOTO_COUNTS, FORMATS } from '../types';
import { useStore } from '../store';

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
    const { photosPerPage, setPhotosPerPage, autoFit10x15, setAutoFit10x15, selectedFormatId, customFormats } = useStore();
    const allFormats = [...FORMATS, ...customFormats];
    const selectedFormat = allFormats.find(f => f.id === selectedFormatId) || FORMATS[0];

    if (!isOpen) return null;

    const handlePrint = () => {
        onPrint();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 sm:p-8 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
                    aria-label="Close print options dialog"
                >
                    <XCircle size={24} />
                </button>
                <h2 className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400 mb-6 select-none">Print Options</h2>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-40 select-none" htmlFor="photosPerPageDialog">Photos per page</label>
                        <select
                            id="photosPerPageDialog"
                            value={photosPerPage}
                            onChange={(e) => setPhotosPerPage(Number(e.target.value) as PhotoCount)}
                            className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600"
                            disabled={autoFit10x15}
                        >
                            {PHOTO_COUNTS.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                        <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-40 select-none" htmlFor="autoFitDialog">Auto-fit 10×15 cm</label>
                        <input
                            id="autoFitDialog"
                            type="checkbox"
                            checked={autoFit10x15}
                            onChange={(e) => setAutoFit10x15(e.target.checked)}
                            className="h-4 w-4 accent-red-600 text-red-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:focus:ring-red-600 ring-offset-white dark:ring-offset-zinc-800 focus:ring-2 cursor-pointer"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {autoFit10x15
                            ? 'Count is determined automatically to fit the paper.'
                            : `Prints on a standard sheet. Your photo size is ${selectedFormat.printWidthIn.toFixed(2)}×${selectedFormat.printHeightIn.toFixed(2)} in.`}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-8">
                    <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600">
                        Cancel
                    </button>
                    <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600">
                        <Printer size={18} />
                        Print Now
                    </button>
                </div>
            </div>
        </div>
    );
}