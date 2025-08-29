import { RefObject } from 'react';
import { Camera, Computer, Loader2, CheckCircle, PlusCircle } from 'lucide-react';
import { Format } from '../types';

type CameraViewProps = {
  isCameraOn: boolean;
  isCameraLoading: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  selectedFormat: Format;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapturePhoto: () => void;
  onUploadClick: () => void;
  onManageFormatsClick: () => void;
};

export function CameraView({
  isCameraOn,
  isCameraLoading,
  videoRef,
  selectedFormat,
  onStartCamera,
  onStopCamera,
  onCapturePhoto,
  onUploadClick,
  onManageFormatsClick,
}: CameraViewProps) {
  // Human-proportional guide sizing (kept stable across formats)
  const guideOvalWidthPct = 42; // Approximate face width relative to frame width
  const guideOvalHeightPct = 64; // Approximate face height relative to frame height
  const innerOvalWidthPct = Math.round(guideOvalWidthPct * 0.72); // Head oval narrower than face boundary
  const innerOvalHeightPct = Math.round(guideOvalHeightPct * 0.80); // Head oval shorter than face boundary
  const eyeLineTopPct = 45; // Eye line ~45% from top

  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-red-800/50 ring-1 ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-red-400 select-none">Preview</h2>
        <button
          onClick={onManageFormatsClick}
          className="flex items-center gap-2 text-sm text-red-300/80 hover:text-red-300 transition-colors py-1 px-3 rounded hover:bg-zinc-800 cursor-pointer"
          title="Change format or manage custom formats"
        >
          <PlusCircle size={16} />
          <span className="select-none">{selectedFormat.label}</span>
        </button>
      </div>

      <div
        className="relative bg-black rounded overflow-hidden mb-4 ring-1 ring-red-900/40"
        style={{ paddingTop: `${(selectedFormat.heightPx / selectedFormat.widthPx) * 100}%` }}
      >
        {isCameraOn ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />
            {/* Guide overlay (responsive to selected format) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Face bounding oval */}
              <div
                className="absolute border-2 border-white border-dashed rounded-full opacity-70"
                style={{
                  width: `${guideOvalWidthPct}%`,
                  height: `${guideOvalHeightPct}%`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              {/* Head positioning inner oval */}
              <div
                className="absolute border border-white border-dashed rounded-full opacity-50"
                style={{
                  width: `${innerOvalWidthPct}%`,
                  height: `${innerOvalHeightPct}%`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              {/* Eye level guide */}
              <div
                className="absolute left-[4%] right-[4%] h-0.5 bg-white opacity-40"
                style={{ top: `${eyeLineTopPct}%` }}
              />
              {/* Center line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white opacity-30 transform -translate-x-0.5" />
            </div>
            {/* Corner guides for framing */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white opacity-60"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white opacity-60"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs bg-black/40 rounded px-2 py-1 text-center select-none">
                Align your face with the oval guide<br />
                Eyes on the horizontal line
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <div className="flex flex-col items-center">
              {isCameraLoading ? (
                <>
                  <Loader2 size={32} className="animate-spin mb-2 text-red-500" />
                  <p className="text-sm text-gray-400">Starting camera…</p>
                </>
              ) : (
                <>
                  <Camera size={42} className="mx-auto mb-2 opacity-70" />
                  <p className="select-none text-sm text-gray-400">Camera not started</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isCameraOn ? (
          <>
            <button
              onClick={onStartCamera}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              disabled={isCameraLoading}
            >
              {isCameraLoading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={20} />}
              {isCameraLoading ? 'Starting…' : 'Start Camera'}
            </button>
            <button
              onClick={onUploadClick}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-700 text-white py-3 px-4 rounded hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
              disabled={isCameraLoading}
            >
              <Computer size={20} />
              Upload Image
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onCapturePhoto}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
            >
              <CheckCircle size={20} />
              Capture Photo
            </button>
            <button
              onClick={onStopCamera}
              className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}