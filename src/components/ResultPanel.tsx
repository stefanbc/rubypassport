import { Image as ImageIcon, Download, Trash2, Printer, Copyright, Loader2 } from 'lucide-react';
import { Format } from '../types';

type ResultPanelProps = {
  isProcessingImage: boolean;
  capturedImage: string | null;
  selectedFormat: Format;
  personName: string;
  onPersonNameChange: (name: string) => void;
  watermarkEnabled: boolean;
  onWatermarkChange: (enabled: boolean) => void;
  onDownload: () => void;
  onRetake: () => void;
  onOpenPrintDialog: () => void;
};

export function ResultPanel({
  isProcessingImage,
  capturedImage,
  selectedFormat,
  personName,
  onPersonNameChange,
  watermarkEnabled,
  onWatermarkChange,
  onDownload,
  onRetake,
  onOpenPrintDialog,
}: ResultPanelProps) {
  const { widthPx, heightPx, label } = selectedFormat;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 select-none">Result</h2>
        {capturedImage && !isProcessingImage && (
          <button onClick={onRetake} className="flex items-center gap-2 text-sm text-red-500/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 transition-colors transition-transform duration-150 hover:-translate-y-0.5 py-1 px-3 rounded bg-red-100/50 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer">
            <Trash2 size={16} />
            Retake
          </button>
        )}
      </div>

      <div
        className="relative bg-gray-200 dark:bg-black rounded overflow-hidden mb-4 ring-1 ring-red-200 dark:ring-red-900/40"
        style={{ paddingTop: `${(heightPx / widthPx) * 100}%`, contain: 'strict' }}
      >
        {/* Render image if we have one, regardless of processing state */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured passport"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}

        {/* Show loader if processing. It will overlay the image if it exists. */}
        {isProcessingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm transition-opacity duration-300">
            <Loader2 size={32} className="animate-spin mb-2 text-red-500" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Processing photo...</p>
          </div>
        )}

        {/* Show placeholder only if there's no image and we're not processing */}
        {!capturedImage && !isProcessingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
            <ImageIcon size={42} className="mx-auto mb-2 opacity-70" />
            <p className="select-none text-sm text-gray-500 dark:text-gray-400">Capture or import a photo</p>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded select-none">
          {label} ({widthPx}x{heightPx}px)
        </div>
        {capturedImage && !isProcessingImage && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => onWatermarkChange(!watermarkEnabled)}
              className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer ${
                watermarkEnabled
                  ? 'bg-red-600/80 text-white hover:bg-red-700'
                  : 'bg-gray-500/50 text-white hover:bg-gray-600/70 dark:bg-black/50 dark:text-gray-300 dark:hover:bg-black/70 dark:hover:text-white'
              }`}
              title={watermarkEnabled ? 'Disable watermark' : 'Enable watermark'}
            >
              <Copyright size={14} />
              <span className="select-none">Watermark</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={personName}
          onChange={(e) => onPersonNameChange(e.target.value)}
          placeholder="Person's Name (optional)"
          className="w-full bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600"
        />
        <div className="flex gap-3">
          <button
            onClick={onDownload}
            disabled={!capturedImage || isProcessingImage}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-xs md:text-base"
          >
            <Download size={20} />
            Download
          </button>
          <button
            onClick={onOpenPrintDialog}
            disabled={!capturedImage || isProcessingImage}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-3 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-xs md:text-base"
          >
            <Printer size={20} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}