import { XCircle, Download, ImageDown } from 'lucide-react';
import { useStore } from '../../store';

type DownloadOptionsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownloadProcessed: () => void;
  onDownloadHighRes: () => void;
};

export function DownloadOptionsDialog({
  isOpen,
  onClose,
  onDownloadProcessed,
  onDownloadHighRes,
}: DownloadOptionsDialogProps) {
  const hasHighRes = useStore(state => !!state.highResBlob);
  if (!isOpen) return null;

  const handleDownloadProcessed = () => {
    onDownloadProcessed();
    onClose();
  };

  const handleDownloadHighRes = () => {
    onDownloadHighRes();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-md flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3">
            <Download size={24} />
            Download Options
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
            aria-label="Close download options dialog"
          >
            <XCircle size={22} />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-800/50 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Choose which version of the photo you would like to download.
          </p>
          <button
            onClick={handleDownloadProcessed}
            className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
          >
            <Download size={20} />
            <span>Download Processed Photo</span>
          </button>
          <button
            onClick={handleDownloadHighRes}
            disabled={!hasHighRes}
            className="w-full flex items-center justify-center gap-3 bg-gray-600 dark:bg-zinc-700 text-white py-3 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
            title={!hasHighRes ? "High-resolution original is not available for this photo." : "Download the original, un-cropped photo."}
          >
            <ImageDown size={20} />
            <span>Download Original (Hi-Res)</span>
          </button>
          {!hasHighRes && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              A high-resolution original is only available for photos taken with the high-res camera option or from an imported file.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}