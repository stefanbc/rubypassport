import { useCallback, useState, DragEvent, useRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import { XCircle, Check, RotateCcw, Move, UploadCloud } from 'lucide-react';
import { Format } from '../types';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCropped: (originalFile: File, croppedDataUrl: string) => void;
  selectedFormat: Format;
  addToast: (message: string, type: 'error' | 'info' | 'success', duration?: number) => void;
}

export function ImportDialog({ isOpen, onClose, onImageCropped, selectedFormat, addToast }: ImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, imgX: 0, imgY: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showRepositionGuide, setShowRepositionGuide] = useState(false);
  const panStartedOnCropper = useRef(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setOriginalFile(null);
    setPosition({ x: 0, y: 0 });
    dragCounter.current = 0;
    setIsDragging(false);
    panStartedOnCropper.current = false;
    setShowRepositionGuide(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        handleReset();
      }, 300); // Allow closing animation to finish
    }
  }, [isOpen, handleReset]);

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file.', 'error');
      return;
    }

    setOriginalFile(file);
    setShowRepositionGuide(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    handleFile(e.dataTransfer.files?.[0]);
  }, [addToast]);

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });

    if (cropContainerRef.current) {
      const { clientWidth: cropW, clientHeight: cropH } = cropContainerRef.current;
      const imageAspectRatio = img.naturalWidth / img.naturalHeight;
      const cropAspectRatio = selectedFormat.widthPx / selectedFormat.heightPx;

      let imgDisplayW, imgDisplayH;
      if (imageAspectRatio > cropAspectRatio) {
        imgDisplayH = cropH;
        imgDisplayW = imgDisplayH * imageAspectRatio;
      } else {
        imgDisplayW = cropW;
        imgDisplayH = imgDisplayW / imageAspectRatio;
      }
      setPosition({ x: (cropW - imgDisplayW) / 2, y: (cropH - imgDisplayH) / 2 });
    }
  };

  const getImageStyle = (): React.CSSProperties => {
    if (!imageDimensions.width || !cropContainerRef.current) return {};
    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    const cropAspectRatio = selectedFormat.widthPx / selectedFormat.heightPx;
    return imageAspectRatio > cropAspectRatio ? { height: '100%', width: 'auto' } : { width: '100%', height: 'auto' };
  };

  const handlePanStart = (e: ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    panStartedOnCropper.current = true;
    setIsPanning(true);
    setShowRepositionGuide(false);
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    setPanStart({ x: clientX, y: clientY, imgX: position.x, imgY: position.y });
  };

  useEffect(() => {
    const handlePanEnd = () => {
      setIsPanning(false);
      // After a pan, we want to prevent the next click (which happens on mouseup)
      // from closing the dialog if it lands on the backdrop.
      // We reset the flag after a tick, so the click event handler on the backdrop
      // can check it, but subsequent clicks will behave normally.
      setTimeout(() => (panStartedOnCropper.current = false), 0);
    };

    const handlePanMove = (e: MouseEvent | TouchEvent) => {
      // Listener is only active when panning, so no need for isPanning check
      if (!imageRef.current || !cropContainerRef.current) return;

      // Prevent page from scrolling on touch devices
      if (e.cancelable) e.preventDefault();

      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
      const dx = clientX - panStart.x;
      const dy = clientY - panStart.y;
      const { clientWidth: cropW, clientHeight: cropH } = cropContainerRef.current;
      const { clientWidth: imgW, clientHeight: imgH } = imageRef.current;

      const newX = panStart.imgX + dx;
      const newY = panStart.imgY + dy;

      setPosition({
        x: Math.max(cropW - imgW, Math.min(0, newX)),
        y: Math.max(cropH - imgH, Math.min(0, newY)),
      });
    };

    if (isPanning) {
      window.addEventListener('mousemove', handlePanMove);
      window.addEventListener('touchmove', handlePanMove, { passive: false });
      window.addEventListener('mouseup', handlePanEnd);
      window.addEventListener('touchend', handlePanEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('touchmove', handlePanMove);
      window.removeEventListener('mouseup', handlePanEnd);
      window.removeEventListener('touchend', handlePanEnd);
    };
  }, [isPanning, panStart]);

  const handleBackdropClick = () => {
    // If a pan just ended (the flag is true), we don't close the dialog.
    // The flag will be reset by the timeout in the pan-end effect.
    if (panStartedOnCropper.current) {
      return;
    }
    onClose();
  };

  const handleCrop = () => {
    if (!imageRef.current || !cropContainerRef.current || !originalFile) return;
    const img = imageRef.current;
    const cropContainer = cropContainerRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = selectedFormat.widthPx;
    canvas.height = selectedFormat.heightPx;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      addToast('Could not process image.', 'error');
      return;
    }
    const displayScale = img.clientWidth / img.naturalWidth;
    const sx = -position.x / displayScale;
    const sy = -position.y / displayScale;
    const sWidth = cropContainer.clientWidth / displayScale;
    const sHeight = cropContainer.clientHeight / displayScale;
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 1.0);
    onImageCropped(originalFile, croppedDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer" aria-label="Close dialog">
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4 select-none">{imageSrc ? 'Reposition Image' : 'Import Image'}</h2>

        <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept="image/*" className="hidden" />

        {imageSrc ? (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Drag the image to position it correctly within the frame.</p>
            <div ref={cropContainerRef} className="relative bg-gray-200 dark:bg-black rounded-md overflow-hidden cursor-grab active:cursor-grabbing" style={{ aspectRatio: `${selectedFormat.widthPx} / ${selectedFormat.heightPx}` }}>
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Import preview"
                className="absolute select-none max-w-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  ...getImageStyle(),
                  touchAction: 'none',
                }}
                onLoad={handleImageLoad}
                onMouseDown={handlePanStart}
                onTouchStart={handlePanStart}
                draggable="false"
              />
              {showRepositionGuide && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none transition-opacity duration-300">
                  <div className="flex flex-col items-center text-white animate-pulse drop-shadow-lg">
                    <Move size={48} />
                    <p className="text-sm font-semibold mt-2">Drag to Reposition</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-2 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors cursor-pointer">
                <RotateCcw size={18} />
                Change Image
              </button>
              <button onClick={handleCrop} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
                <Check size={18} />
                Confirm & Crop
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
            className={`mt-4 flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-red-500 bg-red-50 dark:bg-zinc-800' : 'border-gray-300 dark:border-zinc-700'}`}
          >
            <UploadCloud className={`w-12 h-12 mb-3 transition-colors ${isDragging ? 'text-red-600' : 'text-gray-400'}`} />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Drag & drop</span> an image here</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">or</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-center dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-800">
              Choose from computer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}