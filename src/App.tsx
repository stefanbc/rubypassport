import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Computer, Download, RotateCcw, CheckCircle, Printer, XCircle, Sun, Gem, Loader2, Info, Maximize, Minimize } from 'lucide-react';

type Toast = {
  id: number;
  message: string;
  type: 'error' | 'info' | 'success';
};

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Supported passport/ID photo formats
  const FORMATS = [
    { id: 'us_2x2', label: 'US 2x2 in (600×600 px)', widthPx: 600, heightPx: 600, printWidthIn: 2, printHeightIn: 2 },
    { id: 'eu_35x45', label: 'EU/UK 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
    { id: 'ca_50x70', label: 'Canada 50×70 mm (~591×827 px)', widthPx: 591, heightPx: 827, printWidthIn: 50 / 25.4, printHeightIn: 70 / 25.4 },
    { id: 'in_51x51', label: 'India 51×51 mm (~602×602 px)', widthPx: 602, heightPx: 602, printWidthIn: 51 / 25.4, printHeightIn: 51 / 25.4 },
    { id: 'ro_35x45', label: 'Romania 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
    { id: 'cn_33x48', label: 'China 33×48 mm (~390×567 px)', widthPx: 390, heightPx: 567, printWidthIn: 33 / 25.4, printHeightIn: 48 / 25.4 },
    { id: 'ru_35x45', label: 'Russia 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
    { id: 'au_35x45', label: 'Australia 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
    { id: 'br_50x70', label: 'Brazil 50×70 mm (~591×827 px)', widthPx: 591, heightPx: 827, printWidthIn: 50 / 25.4, printHeightIn: 70 / 25.4 },
    { id: 'mx_25x30', label: 'Mexico 25×30 mm (~295×354 px)', widthPx: 295, heightPx: 354, printWidthIn: 25 / 25.4, printHeightIn: 30 / 25.4 }
  ] as const;
  type FormatId = typeof FORMATS[number]['id'];

  const [selectedFormatId, setSelectedFormatId] = useState<FormatId>('eu_35x45');
  const [personName, setPersonName] = useState<string>('');
  const PHOTO_COUNTS = [1, 2, 4, 6, 8, 10, 12] as const;
  type PhotoCount = typeof PHOTO_COUNTS[number];
  const [photosPerPage, setPhotosPerPage] = useState<PhotoCount>(4);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [autoFit10x15, setAutoFit10x15] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const selectedFormat = FORMATS.find(f => f.id === selectedFormatId)!;
  // Human-proportional guide sizing (kept stable across formats)
  const guideOvalWidthPct = 42;     // Approximate face width relative to frame width
  const guideOvalHeightPct = 64;    // Approximate face height relative to frame height
  const innerOvalWidthPct = Math.round(guideOvalWidthPct * 0.72);  // Head oval narrower than face boundary
  const innerOvalHeightPct = Math.round(guideOvalHeightPct * 0.80); // Head oval shorter than face boundary
  const eyeLineTopPct = 45;         // Eye line ~45% from top

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const addToast = (message: string, type: 'error' | 'info' | 'success' = 'info', duration: number = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const applyWatermark = (context: CanvasRenderingContext2D, targetWidth: number, targetHeight: number) => {
    context.save();
    const diagonalRadians = -25 * Math.PI / 180;
    const baseSize = Math.min(targetWidth, targetHeight);
    const fontSize = Math.max(14, Math.floor(baseSize * 0.075));
    context.font = `600 ${fontSize}px 'EB Garamond', 'Garamond', 'Times New Roman', serif`;
    context.fillStyle = 'rgba(255,255,255,0.04)';
    context.strokeStyle = 'rgba(255,255,255,0.03)';
    context.lineWidth = Math.max(0.4, Math.floor(fontSize * 0.02));
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Create a tiled pattern of watermark text sized to avoid overlaps
    const text = '💎 RUBY PASSPORT';
    const metrics = context.measureText(text);
    const textWidth = Math.max(metrics.width, fontSize * 6);
    const stepX = textWidth + fontSize * 1.25; // horizontal spacing
    const stepY = fontSize * 2.6; // vertical spacing

    context.translate(targetWidth / 2, targetHeight / 2);
    context.rotate(diagonalRadians);
    // Draw staggered grid centered, covering full area
    let row = 0;
    for (let y = -targetHeight; y <= targetHeight; y += stepY) {
      const xOffset = (row % 2 === 0) ? 0 : stepX / 2;
      for (let x = -targetWidth; x <= targetWidth; x += stepX) {
        context.fillText(text, x + xOffset, y);
        context.strokeText(text, x + xOffset, y);
      }
      row++;
    }
    context.restore();
  };

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        addToast(
          `Error attempting to enable full-screen mode: ${err.message}`,
          'error'
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };


  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle video element setup when stream is available
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Setting video source...');
      videoRef.current.srcObject = stream;

      const video = videoRef.current;

      // Add multiple event listeners to ensure video starts
      const handleLoadedMetadata = async () => {
        console.log('Video metadata loaded');
        try {
          await video.play();
          console.log('Video playing');
          setIsCameraLoading(false);
        } catch (playError: unknown) {
          if (playError instanceof Error) {
            addToast(`Could not start video playback: ${playError.message}`, 'error');
          } else {
            addToast('Could not start video playback.', 'error');
          }
        }
      };

      const handleCanPlay = () => {
        console.log('Video can play');
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);

      // Force play attempt
      video.play().catch(() => {
        addToast('Waiting for camera permissions...', 'info');
      });

      // Cleanup event listeners
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      addToast('Starting camera...', 'info');
      setIsCameraLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      console.log('Got media stream:', mediaStream);
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (err) {
      addToast(`Camera error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
      setIsCameraOn(false);
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to selected format size
    const targetWidth = selectedFormat.widthPx;
    const targetHeight = selectedFormat.heightPx;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Calculate aspect ratios
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const canvasAspectRatio = targetWidth / targetHeight;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;

    // Crop to match selected aspect ratio
    if (videoAspectRatio > canvasAspectRatio) {
      // Video is wider relative to target; crop horizontally
      sourceHeight = video.videoHeight;
      sourceWidth = sourceHeight * canvasAspectRatio;
      sourceX = (video.videoWidth - sourceWidth) / 2;
    } else {
      // Video is taller relative to target; crop vertically
      sourceWidth = video.videoWidth;
      sourceHeight = sourceWidth / canvasAspectRatio;
      sourceY = (video.videoHeight - sourceHeight) / 2;
    }

    // Draw the cropped and scaled image
    context.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, targetWidth, targetHeight
    );

    // Apply watermark if enabled
    if (watermarkEnabled) {
      applyWatermark(context, targetWidth, targetHeight);
    }

    // Convert to high-quality image
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageDataUrl);
    addToast('Photo captured successfully!', 'success');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== 'string') {
        addToast('Failed to read image data.', 'error');
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const targetWidth = selectedFormat.widthPx;
        const targetHeight = selectedFormat.heightPx;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const imageAspectRatio = img.width / img.height;
        const canvasAspectRatio = targetWidth / targetHeight;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (imageAspectRatio > canvasAspectRatio) {
          sourceHeight = img.height;
          sourceWidth = sourceHeight * canvasAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          sourceWidth = img.width;
          sourceHeight = sourceWidth / canvasAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        context.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, targetWidth, targetHeight
        );

        if (watermarkEnabled) {
          applyWatermark(context, targetWidth, targetHeight);
        }

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageDataUrl);
        addToast('Image uploaded successfully!', 'success');
      };
      img.onerror = () => addToast('Failed to load the selected image.', 'error');
      img.src = result;
    };
    reader.onerror = () => addToast('Failed to read the selected file.', 'error');
    reader.readAsDataURL(file);

    // Reset file input value to allow selecting the same file again
    e.target.value = '';
  };

  const downloadImage = () => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    const safeName = personName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
    const namePart = safeName ? `${safeName}-` : '';
    link.download = `${namePart}passport-${selectedFormat.id}-${selectedFormat.widthPx}x${selectedFormat.heightPx}-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
    addToast('Image downloaded!', 'success');
  };

  const openPrintPreview = () => {
    if (!capturedImage) return;
    addToast('Preparing print preview...', 'info');
    const printWin = window.open('', '_blank');
    if (!printWin) {
      addToast('Could not open print window. Please disable your pop-up blockers.', 'error');
      return;
    }
    const widthIn = selectedFormat.printWidthIn;
    const heightIn = selectedFormat.printHeightIn;
    // Paper size: 10x15 cm (approx 3.94 x 5.91 in)
    const paperW = 15 / 2.54; // ~5.91 in
    const paperH = 10 / 2.54; // ~3.94 in
    const gapIn = 0.15; // equal row/column gap

    // Compute best orientation fit (landscape or portrait for the sheet)
    const fitFor = (sheetW: number, sheetH: number) => {
      const cols = Math.max(1, Math.floor((sheetW + gapIn) / (widthIn + gapIn)));
      const rows = Math.max(1, Math.floor((sheetH + gapIn) / (heightIn + gapIn)));
      return { cols, rows, count: cols * rows, sheetW, sheetH };
    };
    const landscape = fitFor(paperW, paperH);
    const portrait = fitFor(paperH, paperW);
    const best = landscape.count >= portrait.count ? landscape : portrait;
    const fitCount = best.count;
    const sheetWidthIn = best.sheetW;
    const sheetHeightIn = best.sheetH;
    const cols = best.cols;

    const totalImages = autoFit10x15 ? fitCount : photosPerPage;
    const doc = printWin.document;
    const html = doc.documentElement;
    const head = doc.createElement('head');
    const body = doc.createElement('body');

    const metaCharset = doc.createElement('meta');
    metaCharset.setAttribute('charset', 'utf-8');
    const metaViewport = doc.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1';
    const title = doc.createElement('title');
    title.textContent = personName ? `${personName} – Print Preview` : 'Print Preview';
    const style = doc.createElement('style');
    style.textContent = `
      @page { margin: 0.5in; }
      html, body { height: 100%; }
      body { background: #fff; margin: 0; display: flex; align-items: center; justify-content: center; }
      .sheet {
        display: grid;
        ${autoFit10x15 ? `grid-template-columns: repeat(${cols}, ${widthIn}in);` : `grid-template-columns: repeat(auto-fill, minmax(${widthIn}in, ${widthIn}in));`}
        grid-auto-rows: ${heightIn}in;
        gap: ${gapIn}in; /* equal gap for rows and columns */
        align-content: start;
        justify-content: start;
        padding: 0;
        box-sizing: border-box;
        ${autoFit10x15 ? `width: ${sheetWidthIn}in; height: ${sheetHeightIn}in;` : 'width: 100%; height: 100%;'}
      }
      .photo { width: 100%; height: 100%; object-fit: cover; }
      @media print { body { margin: 0; } }
    `;

    head.appendChild(metaCharset);
    head.appendChild(metaViewport);
    head.appendChild(title);
    head.appendChild(style);

    const sheet = doc.createElement('div');
    sheet.className = 'sheet';
    const countToRender = totalImages;
    for (let i = 0; i < countToRender; i++) {
      const img = doc.createElement('img');
      img.className = 'photo';
      img.src = capturedImage;
      img.alt = 'Passport portrait';
      sheet.appendChild(img);
    }
    body.appendChild(sheet);

    // Replace full document
    html.replaceChildren();
    html.appendChild(head);
    html.appendChild(body);

    // Wait for images to load then print
    const waitForImages = () => {
      const images = Array.from(doc.images);
      if (images.length === 0) return printWin.print();
      let loaded = 0;
      images.forEach((im) => {
        if (im.complete) {
          loaded++;
          if (loaded === images.length) setTimeout(() => printWin.print(), 100);
        } else {
          im.onload = () => {
            loaded++;
            if (loaded === images.length) setTimeout(() => printWin.print(), 100);
          };
          im.onerror = () => {
            loaded++;
            if (loaded === images.length) setTimeout(() => printWin.print(), 100);
          };
        }
      });
    };
    waitForImages();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-red-950 p-4 flex items-center justify-center">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 ring-1 ring-red-900/40 flex items-center justify-center shadow-md">
              <Gem size={18} className="text-white" />
            </div>
            <div className="leading-tight select-none">
              <div className="text-white font-semibold tracking-tight">RubyPassport</div>
              <div className="text-[11px] text-red-300/80">Passport Photo Generator</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Toast Container */}
            <div className="space-y-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`relative flex items-center text-sm transition-all duration-300 ease-in-out select-none ${toast.type === 'error' ? 'text-red-600' : toast.type === 'success' ? 'text-green-600' : 'text-gray-200'
                    }`}
                >
                  <div className="mr-3">
                    {toast.type === 'error' && <XCircle size={20} />}
                    {toast.type === 'success' && <CheckCircle size={20} />}
                    {toast.type === 'info' && <Info size={20} />}
                  </div>
                  <span className="flex-1">{toast.message}</span>
                </div>
              ))}
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full text-gray-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Guidelines (Left) */}
          <div className="bg-zinc-900 rounded-xl shadow-xl p-6 border border-red-800/50 ring-1 ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
            <h2 className="text-xl font-semibold text-red-400 mb-1 select-none">Passport Photo Guidelines</h2>
            <p className="text-xs text-gray-400 mb-4">Follow these for most country standards.</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <h4 className="font-medium text-gray-200">Do</h4>
                </div>
                <ul className="text-sm text-gray-400 space-y-1 pl-1">
                  <li>• Keep your head centered and straight</li>
                  <li>• Look directly at the camera</li>
                  <li>• Maintain a neutral expression (mouth closed)</li>
                  <li>• Remove glasses and headwear (unless religious)</li>
                  <li>• Ensure eyes are clearly visible</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-red-400" />
                  <h4 className="font-medium text-gray-200">Don't</h4>
                </div>
                <ul className="text-sm text-gray-400 space-y-1 pl-1">
                  <li>• No smiling, tilting, or squinting</li>
                  <li>• No heavy makeup or filters</li>
                  <li>• Avoid hats, headphones, or accessories</li>
                  <li>• Avoid harsh shadows or backlight</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sun size={16} className="text-yellow-300" />
                  <h4 className="font-medium text-gray-200">Lighting & Background</h4>
                </div>
                <ul className="text-sm text-gray-400 space-y-1 pl-1">
                  <li>• Use bright, even lighting from the front</li>
                  <li>• Stand ~0.5 m from a plain, light background</li>
                  <li>• Avoid strong shadows under chin or nose</li>
                  <li>• Prefer mid-tone clothing (not white)</li>
                </ul>
              </div>
              <div className="mt-1 rounded-md bg-zinc-800/60 border border-red-900/40 p-3">
                <p className="text-xs text-gray-300">
                  Tip: Align your face within the outer oval. The eye line should be near the guide.
                </p>
              </div>
              <div className="mt-1 rounded-md bg-zinc-800/60 border border-red-900/40 p-3">
                <p className="text-xs text-gray-300">
                  <span className="font-semibold">Your Privacy Matters</span><br />
                  This app is designed with your privacy in mind. Everything happens right in your browser — we never upload, store, or save your images anywhere. Once you’re done, they’re gone.
                </p>
              </div>
            </div>
          </div>

          {/* Camera Section (Center) */}
          <div className="bg-zinc-900 rounded-xl shadow-xl p-6 border border-red-800/50 ring-1 ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
            <h2 className="text-xl font-semibold text-red-400 mb-4 select-none">Camera Preview</h2>
            <div className="mb-4 flex items-center gap-3">
              <label className="text-gray-300 text-sm w-32 select-none" htmlFor="format">Photo format</label>
              <select
                id="format"
                value={selectedFormatId}
                onChange={(e) => setSelectedFormatId(e.target.value as FormatId)}
                className="flex-1 bg-black text-white text-sm px-3 py-2 rounded-lg border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {FORMATS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            <div
              className="relative bg-black rounded-lg overflow-hidden mb-4 ring-1 ring-red-900/40"
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
                    onClick={startCamera}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    disabled={isCameraLoading}
                  >
                    {isCameraLoading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={20} />}
                    {isCameraLoading ? 'Starting…' : 'Start Camera'}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-700 text-white py-3 px-4 rounded-lg hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                    disabled={isCameraLoading}
                  >
                    <Computer size={20} />
                    Upload Image
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                  >
                    <CheckCircle size={20} />
                    Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                  >
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Result Section (Right) */}
          <div className="bg-zinc-900 rounded-xl shadow-xl p-6 border border-red-800/50 ring-1 ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
            <h2 className="text-xl font-semibold text-red-400 mb-4 select-none">Passport Photo</h2>
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <label className="text-gray-300 text-sm sm:w-40 select-none" htmlFor="personName">Person name</label>
                <input
                  id="personName"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
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
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  className="h-4 w-4 accent-red-600"
                />
                <span className="text-xs text-gray-400">Barely visible overlay on generated photo</span>
              </div>
            </div>

            {capturedImage && (
              <div className="space-y-3">
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                >
                  <Download size={20} />
                  Download Photo ({selectedFormat.widthPx}×{selectedFormat.heightPx}px)
                </button>
                <button
                  onClick={openPrintPreview}
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
                    onChange={(e) => setPhotosPerPage(Number(e.target.value) as PhotoCount)}
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
                    onChange={(e) => setAutoFit10x15(e.target.checked)}
                    className="h-4 w-4 accent-red-600"
                  />
                  <span className="text-xs text-gray-400">Overrides count to best fit on 10×15cm</span>
                </div>
                <button
                  onClick={retakePhoto}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                >
                  <RotateCcw size={20} />
                  Retake Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-red-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <p className="text-xs text-gray-400 md:text-left">© {new Date().getFullYear()} RubyPassport. All rights reserved. Part of the <a href="https://www.rubytriathlon.com/" className="text-red-300/80 hover:text-red-300" target="_blank" rel="noopener noreferrer">Ruby Triathlon</a> project.</p>
            <p className="text-xs text-gray-400 md:text-center">
              Made with ❤️ by <a href="https://stefancosma.xyz" className="text-red-300/80 hover:text-red-300" target="_blank" rel="noopener noreferrer">Stefan</a>
            </p>
            <p className="text-xs text-gray-400 md:text-right">
              {import.meta.env.VITE_GIT_COMMIT_HASH && (
                <span className="mr-2">v{import.meta.env.VITE_GIT_COMMIT_HASH.substring(0, 7)}</span>
              )}
              <a href="https://github.com/stefanbc/rubypassport" className="text-red-300/80 hover:text-red-300" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-text-bottom mr-1" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
                GitHub
              </a>
            </p>
          </div>
        </div>

        {/* Hidden canvas for photo processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

export default App;