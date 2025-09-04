import { XCircle, Download, ImageDown } from 'lucide-react';

type DownloadOptionsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownloadProcessed: () => void;
  onDownloadHighRes: () => void;
  hasHighRes: boolean;
};

export function DownloadOptionsDialog({
  isOpen,
  onClose,
  onDownloadProcessed,
  onDownloadHighRes,
  hasHighRes,
}: DownloadOptionsDialogProps) {
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
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-8 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600" aria-label="Close download options dialog">
          <XCircle size={24} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Download size={24} className="text-red-600 dark:text-red-400" />
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 select-none">Download Options</h2>
        </div>
        <div className="space-y-4">
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