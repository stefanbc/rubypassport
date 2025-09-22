import { Image as ImageIcon, Download, Trash2, Printer, Loader2, Copyright, RotateCcw } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store';
import { FORMATS } from '../types';

type ResultPanelProps = {
  onDownload: () => void;
  onRetake: () => void;
  onOpenPrintDialog: () => void;
};

export function ResultPanel({
  onDownload,
  onRetake,
  onOpenPrintDialog,
}: ResultPanelProps) {
  const {
    isProcessingImage,
    capturedImage,
    personName,
    setPersonName,
    watermarkEnabled,
    setWatermarkEnabled,
    watermarkText,
    setWatermarkText,
    isMobile,
    selectedFormatId,
    customFormats,
    captureQueue,
  } = useStore();

  const allFormats = [...FORMATS, ...customFormats];
  const selectedFormat = allFormats.find(f => f.id === selectedFormatId) || FORMATS[0];
  const { widthPx, heightPx, label } = selectedFormat;
  const [isWatermarkPopoverOpen, setIsWatermarkPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const watermarkButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isWatermarkPopoverOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        watermarkButtonRef.current &&
        !watermarkButtonRef.current.contains(event.target as Node)
      ) {
        setIsWatermarkPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isWatermarkPopoverOpen]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Prevent the page from unloading immediately.
      event.preventDefault();
      // Note: Most modern browsers show a generic message and ignore this custom one for security reasons.
      event.returnValue = 'Are you sure you want to leave? Your generated photo will be lost.';
    };

    if (capturedImage) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Cleanup the event listener when the component unmounts or the image is cleared.
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [capturedImage]);

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 ${!isMobile && 'shadow-xl hover:shadow-2xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none">Result</h2>
        <div className="relative flex items-center gap-2">
          {capturedImage && !isProcessingImage && (
            <>
              <button
                ref={watermarkButtonRef}
                onClick={() => setIsWatermarkPopoverOpen(!isWatermarkPopoverOpen)}
                className={`flex items-center text-sm p-2 rounded-md transition-colors ${watermarkEnabled
                    ? 'bg-red-600/80 text-white hover:bg-red-700'
                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'
                  }`}
                title={watermarkEnabled ? 'Edit watermark' : 'Add watermark'}
              >
                <Copyright size={16} />
              </button>
              <button onClick={onRetake} className="flex items-center gap-2 text-sm text-red-500/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 transition-colors transition-transform duration-150 hover:-translate-y-0.5 py-2 px-3 rounded-md bg-red-100/50 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600">
                <Trash2 size={16} />
                Retake
              </button>
            </>
          )}
          {isWatermarkPopoverOpen && (
            <div
              ref={popoverRef}
              className="absolute top-full right-0 mt-2 z-10 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-700 p-4 space-y-3 animate-in fade-in-5 slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between">
                <label htmlFor="watermarkEnabled" className="text-gray-800 dark:text-gray-100 text-sm font-medium select-none cursor-pointer flex-grow">Enable Watermark</label>
                <input id="watermarkEnabled" type="checkbox" checked={watermarkEnabled} onChange={(e) => setWatermarkEnabled(e.target.checked)} className="h-4 w-4 accent-red-600 text-red-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:focus:ring-red-600 ring-offset-white dark:ring-offset-zinc-800 focus:ring-2 cursor-pointer" />
              </div>
              <div className="relative">
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="Watermark Text" disabled={!watermarkEnabled} className="w-full bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm py-2 px-3 rounded border border-red-200 dark:border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                <button onClick={() => setWatermarkText('💎 RUBY PASSPORT')} disabled={!watermarkEnabled} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-0" title="Reset to default">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
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
      </div>

      <div className="flex-grow" />

      <div className="space-y-4">
        <input
          type="text"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Person's Name (optional)"
          className="w-full bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm py-3 px-4 rounded border border-red-200 dark:border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDownload}
            disabled={(!capturedImage && captureQueue.length === 0) || isProcessingImage}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
          >
            <Download size={20} />
            Download
          </button>
          <button
            onClick={onOpenPrintDialog}
            disabled={(!capturedImage && captureQueue.length === 0) || isProcessingImage}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-3 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
          >
            <Printer size={20} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}