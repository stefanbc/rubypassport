import { Download, RotateCcw, Printer } from 'lucide-react';
import { Format, PhotoCount, PHOTO_COUNTS } from '../types';

type ResultPanelProps = {
  capturedImage: string | null;
  selectedFormat: Format;
  personName: string;
  onPersonNameChange: (name: string) => void;
  watermarkEnabled: boolean;
  onWatermarkChange: (enabled: boolean) => void;
  onDownload: () => void;
  onRetake: () => void;
  onPrint: () => void;
  photosPerPage: PhotoCount;
  onPhotosPerPageChange: (count: PhotoCount) => void;
  autoFit10x15: boolean;
  onAutoFitChange: (enabled: boolean) => void;
};

export function ResultPanel({
  capturedImage,
  selectedFormat,
  personName,
  onPersonNameChange,
  watermarkEnabled,
  onWatermarkChange,
  onDownload,
  onRetake,
  onPrint,
  photosPerPage,
  onPhotosPerPageChange,
  autoFit10x15,
  onAutoFitChange,
}: ResultPanelProps) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow-xl p-6 border border-red-800/50 ring-1 ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
      <h2 className="text-xl font-semibold text-red-400 mb-4 select-none">Passport Photo</h2>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <label className="text-gray-300 text-sm sm:w-40 select-none" htmlFor="personName">Person name</label>
          <input
            id="personName"
            value={personName}
            onChange={(e) => onPersonNameChange(e.target.value)}
            placeholder="e.g., John Doe"
            className="flex-1 bg-black text-white text-sm px-3 py-2 rounded-lg border border-red-900/40 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>

      <div className="w-full mb-4">
        <div
          className="relative bg-neutral-950 rounded-lg overflow-hidden mb-4 border border-red-800/50 ring-1 ring-white/5"
          style={{ paddingTop: `${(selectedFormat.heightPx / selectedFormat.widthPx) * 100}%` }}
        >
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Passport portrait"
              className="absolute inset-0 w-full h-full object-cover fade-in"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="select-none text-center text-gray-500">
                <div className="mx-auto mb-3 border-2 border-dashed border-red-900/40 rounded-md"
                  style={{ width: '40%', height: `${(selectedFormat.heightPx / selectedFormat.widthPx) * 40}%` }}
                />
                <p className="text-sm">Your photo will appear here</p>
                <p className="text-xs text-gray-500 mt-1">{selectedFormat.label}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-gray-300 text-sm sm:w-40 select-none" htmlFor="watermark">Official watermark</label>
          <input
            id="watermark"
            type="checkbox"
            checked={watermarkEnabled}
            onChange={(e) => onWatermarkChange(e.target.checked)}
            className="h-4 w-4 accent-red-600"
          />
          <span className="text-xs text-gray-400">Barely visible overlay on generated photo</span>
        </div>
      </div>

      {capturedImage && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
            >
              <Download size={20} />
              Download
            </button>
            <button
              onClick={onRetake}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
            >
              <RotateCcw size={20} />
              Retake
            </button>
          </div>
          <button
            onClick={onPrint}
            className="w-full flex items-center justify-center gap-2 bg-red-700 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
          >
            <Printer size={20} />
            Print Preview ({selectedFormat.printWidthIn.toFixed(2)}×{selectedFormat.printHeightIn.toFixed(2)} in)
          </button>
          <div className="flex items-center gap-3">
            <label className="text-gray-300 text-sm sm:w-40 select-none" htmlFor="photosPerPage">Photos per page</label>
            <select
              id="photosPerPage"
              value={photosPerPage}
              onChange={(e) => onPhotosPerPageChange(Number(e.target.value) as PhotoCount)}
              className="flex-1 bg-black text-white text-sm px-3 py-2 rounded-lg border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {PHOTO_COUNTS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-gray-300 text-sm sm:w-40 select-none" htmlFor="autoFit">Auto-fit 10×15 cm</label>
            <input
              id="autoFit"
              type="checkbox"
              checked={autoFit10x15}
              onChange={(e) => onAutoFitChange(e.target.checked)}
              className="h-4 w-4 accent-red-600"
            />
            <span className="text-xs text-gray-400">Overrides count to best fit on 10×15cm</span>
          </div>
        </div>
      )}
    </div>
  );
}