import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { Toast, Format, PhotoCount, FormatId, FORMATS } from './types';
import { FormatDialog, NewFormatState } from './components/FormatDialog';
import { Header } from './components/Header';
import { Guidelines } from './components/Guidelines';
import { CameraView } from './components/CameraView';
import { ResultPanel } from './components/ResultPanel';
import { PrintOptionsDialog } from './components/PrintOptionsDialog';
import { Footer } from './components/Footer';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { ThemeProvider } from './contexts/ThemeProvider';

// A type declaration for the ImageCapture API, which might not be in all TypeScript lib versions.
declare class ImageCapture {
  constructor(videoTrack: MediaStreamTrack);
  takePhoto(): Promise<Blob>;
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCaptureRef = useRef<ImageCapture | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toasts, setToasts] = useState<(Toast & { duration: number })[]>([]);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [customFormats, setCustomFormats] = useState<Format[]>([]);
  const [selectedFormatId, setSelectedFormatId] = useState<FormatId>('eu_35x45');
  const [personName, setPersonName] = useState<string>('');
  const [photosPerPage, setPhotosPerPage] = useState<PhotoCount>(6);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);
  const [autoFit10x15, setAutoFit10x15] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [showCustomFormatForm, setShowCustomFormatForm] = useState(false);
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [editingFormat, setEditingFormat] = useState<Format | null>(null);
  const [newFormat, setNewFormat] = useState<NewFormatState>({
    label: '',
    widthPx: '',
    heightPx: '',
    printWidthMm: '',
    printHeightMm: '',
  });

  const allFormats: Format[] = [...FORMATS, ...customFormats];
  const selectedFormat = allFormats.find(f => f.id === selectedFormatId)!;

  const addToast = useCallback((message: string, type: 'error' | 'info' | 'success' = 'info', duration: number = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  // Effect to manage the toast queue, showing one at a time.
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        // Remove the shown toast from the front of the queue
        setToasts(currentToasts => currentToasts.slice(1));
      }, toasts[0].duration);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const applyWatermark = useCallback((context: CanvasRenderingContext2D, targetWidth: number, targetHeight: number) => {
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
  }, []);

  const retakePhoto = useCallback(() => {
    setBaseImage(null);
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
      imageCaptureRef.current = null;
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      addToast('Starting camera...', 'info');
      setIsCameraLoading(true);
      const aspectRatio = selectedFormat.widthPx / selectedFormat.heightPx;
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          // Request a high resolution to get the best possible video feed
          width: { ideal: 4096 },
          // Enforce the same aspect ratio as the selected photo format for a WYSIWYG preview
          aspectRatio: { ideal: aspectRatio },
          facingMode: 'user'
        },
        audio: false
      });

      console.log('Got media stream:', mediaStream);
      setStream(mediaStream);
      setIsCameraOn(true);

      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      if (settings.width && settings.height) {
        addToast(`Camera stream: ${settings.width}x${settings.height}`, 'info', 4000);
      }

      if ('ImageCapture' in window) {
        try {
          imageCaptureRef.current = new ImageCapture(videoTrack);
          addToast('High-resolution capture is available.', 'info', 3000);
        } catch (e) {
          console.error('Could not create ImageCapture:', e);
          imageCaptureRef.current = null;
        }
      } else {
        addToast('High-resolution capture not supported. Using video stream.', 'info', 3000);
      }
    } catch (err) {
      addToast(`Camera error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
      setIsCameraOn(false);
      setIsCameraLoading(false);
    }
  }, [addToast, selectedFormat]);

  const capturePhoto = useCallback(async () => {
    setIsProcessingImage(true);
    // High-res capture with ImageCapture API if available
    if (imageCaptureRef.current) {
      try {
        addToast('Capturing high-resolution photo...', 'info', 2000);
        const blob = await imageCaptureRef.current.takePhoto();
        const imageUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          if (!canvasRef.current) {
            setIsProcessingImage(false);
            return;
          }

          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          if (!context) {
            setIsProcessingImage(false);
            return;
          }

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

          const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
          setBaseImage(imageDataUrl);
          addToast('Photo captured successfully!', 'success');
          URL.revokeObjectURL(imageUrl);
        };
        img.onerror = () => {
          addToast('Failed to process captured photo.', 'error');
          URL.revokeObjectURL(imageUrl);
          setIsProcessingImage(false);
        };
        img.src = imageUrl;
        return; // Exit after handling ImageCapture
      } catch (e) {
        const error = e as Error;
        addToast(`High-res capture failed: ${error.message}. Falling back to video frame.`, 'error');
      }
    }

    // Fallback for browsers without ImageCapture or if it fails
    if (!videoRef.current || !canvasRef.current) {
      setIsProcessingImage(false);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setIsProcessingImage(false);
      return;
    }

    const targetWidth = selectedFormat.widthPx;
    const targetHeight = selectedFormat.heightPx;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const canvasAspectRatio = targetWidth / targetHeight;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;

    if (videoAspectRatio > canvasAspectRatio) {
      sourceHeight = video.videoHeight;
      sourceWidth = sourceHeight * canvasAspectRatio;
      sourceX = (video.videoWidth - sourceWidth) / 2;
    } else {
      sourceWidth = video.videoWidth;
      sourceHeight = sourceWidth / canvasAspectRatio;
      sourceY = (video.videoHeight - sourceHeight) / 2;
    }

    context.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, targetWidth, targetHeight
    );

    const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
    setBaseImage(imageDataUrl);
    addToast('Photo captured from video stream.', 'success');
  }, [addToast, selectedFormat]);

  const downloadImage = useCallback(() => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    const safeName = personName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
    const namePart = safeName ? `${safeName}-` : '';
    link.download = `${namePart}passport-${selectedFormat.id}-${selectedFormat.widthPx}x${selectedFormat.heightPx}-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
    addToast('Image downloaded!', 'success');
  }, [capturedImage, personName, selectedFormat, addToast]);

  const toggleFullscreen = useCallback(() => {
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
  }, [addToast]);

  const handleCancelEdit = useCallback(() => {
    setEditingFormat(null);
    setNewFormat({
      label: '',
      widthPx: '',
      heightPx: '',
      printWidthMm: '',
      printHeightMm: '',
    });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowCustomFormatForm(false);
    handleCancelEdit();
  }, [handleCancelEdit]);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  useEffect(() => {
    try {
      const savedFormats = localStorage.getItem('rubyPassportCustomFormats');
      if (savedFormats) {
        const parsed = JSON.parse(savedFormats);
        if (Array.isArray(parsed)) {
          setCustomFormats(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load custom formats from localStorage', error);
      addToast('Could not load custom formats.', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    try {
      localStorage.setItem('rubyPassportCustomFormats', JSON.stringify(customFormats));
    } catch (error) {
      console.error('Failed to save custom formats to localStorage', error);
      addToast('Could not save custom formats.', 'error');
    }
  }, [customFormats, addToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;

      if (e.key === 'Escape') {
        if (showShortcutsDialog) return setShowShortcutsDialog(false);
        if (showCustomFormatForm) return handleCloseDialog();
        if (showPrintDialog) return setShowPrintDialog(false);
        if (isTyping) (e.target as HTMLElement).blur();
        return;
      }

      if (isTyping) return;

      // No other shortcuts if a dialog is open
      if (showShortcutsDialog || showCustomFormatForm || showPrintDialog) {
        return;
      }

      switch (e.key) {
        case '?':
          setShowShortcutsDialog(true);
          break;
        case 'c':
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          isCameraOn ? stopCamera() : void startCamera();
          break;
        case ' ':
          if (isCameraOn) {
            e.preventDefault(); // Prevent page scroll
            capturePhoto();
          }
          break;
        case 'u':
          if (!isCameraOn) fileInputRef.current?.click();
          break;
        case 'd':
          if (capturedImage) downloadImage();
          break;
        case 'r':
          if (capturedImage) retakePhoto();
          break;
        case 'w':
          if (capturedImage) setWatermarkEnabled(p => !p);
          break;
        case 'p':
          if (capturedImage) setShowPrintDialog(true);
          break;
        case 'f':
          setShowCustomFormatForm(true);
          break;
        case 't':
          // Simulate a click on the theme switcher button
          document.querySelector<HTMLButtonElement>('button[title^="Switch to"]')?.click();
          break;
        case 'Enter':
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCameraOn, capturedImage, showCustomFormatForm, showPrintDialog, showShortcutsDialog, startCamera, stopCamera, capturePhoto, downloadImage, retakePhoto, toggleFullscreen, handleCloseDialog]);

  useEffect(() => {
    if (!baseImage) {
      setCapturedImage(null);
      setIsProcessingImage(false);
      return;
    }

    setIsProcessingImage(true);
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) {
        setIsProcessingImage(false);
        return;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) {
        setIsProcessingImage(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      if (watermarkEnabled) {
        applyWatermark(context, img.width, img.height);
      }

      setCapturedImage(canvas.toDataURL('image/jpeg', 1.0));
      setIsProcessingImage(false);
    };
    img.onerror = () => {
      addToast('Failed to load image for processing.', 'error');
      setIsProcessingImage(false);
    };
    img.src = baseImage;
  }, [baseImage, watermarkEnabled, applyWatermark, addToast]);

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
  }, [stream, addToast]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file.', 'error');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== 'string') {
        addToast('Failed to read image data.', 'error');
        setIsProcessingImage(false);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) {
          setIsProcessingImage(false);
          return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) {
          setIsProcessingImage(false);
          return;
        }

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

        const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        setBaseImage(imageDataUrl);
        addToast('Image uploaded successfully!', 'success');
      };
      img.onerror = () => {
        addToast('Failed to load the selected image.', 'error');
        setIsProcessingImage(false);
      };
      img.src = result;
    };
    reader.onerror = () => {
      addToast('Failed to read the selected file.', 'error');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);

    // Reset file input value to allow selecting the same file again
    e.target.value = '';
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
    const gapIn = 0.10; // equal row/column gap
    const cutMarkLengthIn = gapIn / 2;
    const cutMarkOffsetIn = -cutMarkLengthIn;

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
        ${autoFit10x15
        ? `grid-template-columns: repeat(${cols}, ${widthIn}in);`
        : `grid-template-columns: repeat(auto-fill, minmax(${widthIn}in, ${widthIn}in));`
      }
        grid-auto-rows: ${heightIn}in;
        gap: ${gapIn}in; /* equal gap for rows and columns */
        align-content: start;
        justify-content: start;
        padding: 0;
        box-sizing: border-box;
        ${autoFit10x15
        ? `width: ${sheetWidthIn}in; height: ${sheetHeightIn}in;`
        : 'width: 100%; height: 100%;'
      }
      }
      .photo-container {
        position: relative;
      }
      .photo-container::before, .photo-container::after,
      .photo-container > span::before, .photo-container > span::after {
        content: '';
        position: absolute;
        width: ${cutMarkLengthIn}in;
        height: ${cutMarkLengthIn}in;
        border-color: #aaa;
        border-style: solid;
        box-sizing: border-box;
      }
      .photo-container::before { /* top-left */
        top: ${cutMarkOffsetIn}in; left: ${cutMarkOffsetIn}in; border-width: 1px 0 0 1px;
      }
      .photo-container::after { /* top-right */
        top: ${cutMarkOffsetIn}in; right: ${cutMarkOffsetIn}in; border-width: 1px 1px 0 0;
      }
      .photo-container > span::before { /* bottom-left */
        bottom: ${cutMarkOffsetIn}in; left: ${cutMarkOffsetIn}in; border-width: 0 0 1px 1px;
      }
      .photo-container > span::after { /* bottom-right */
        bottom: ${cutMarkOffsetIn}in; right: ${cutMarkOffsetIn}in; border-width: 0 1px 1px 0;
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
      const photoContainer = doc.createElement('div');
      photoContainer.className = 'photo-container';

      const img = doc.createElement('img');
      img.className = 'photo';
      img.src = capturedImage;
      img.alt = 'Passport portrait';
      photoContainer.appendChild(img);
      photoContainer.appendChild(doc.createElement('span'));
      sheet.appendChild(photoContainer);
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

  const handleEditClick = (formatToEdit: Format) => {
    setEditingFormat(formatToEdit);
    setNewFormat({
      label: formatToEdit.label,
      widthPx: String(formatToEdit.widthPx),
      heightPx: String(formatToEdit.heightPx),
      printWidthMm: (formatToEdit.printWidthIn * 25.4).toFixed(2),
      printHeightMm: (formatToEdit.printHeightIn * 25.4).toFixed(2),
    });
  };

  const handleUpdateCustomFormat = () => {
    if (!editingFormat) return;

    const { label, widthPx, heightPx, printWidthMm, printHeightMm } = newFormat;
    if (!label.trim() || !widthPx || !heightPx || !printWidthMm || !printHeightMm) {
      addToast('Please fill all custom format fields.', 'error');
      return;
    }

    const updatedFormat: Format = {
      id: editingFormat.id,
      label: label.trim(),
      widthPx: parseInt(widthPx, 10),
      heightPx: parseInt(heightPx, 10),
      printWidthIn: parseFloat(printWidthMm) / 25.4,
      printHeightIn: parseFloat(printHeightMm) / 25.4,
    };

    if (
      isNaN(updatedFormat.widthPx) || updatedFormat.widthPx <= 0 ||
      isNaN(updatedFormat.heightPx) || updatedFormat.heightPx <= 0 ||
      isNaN(updatedFormat.printWidthIn) || updatedFormat.printWidthIn <= 0 ||
      isNaN(updatedFormat.printHeightIn) || updatedFormat.printHeightIn <= 0
    ) {
      addToast('Invalid number values for format. All dimensions must be positive.', 'error');
      return;
    }

    setCustomFormats(prev => prev.map(f => (f.id === editingFormat.id ? updatedFormat : f)));
    addToast(`Updated custom format: ${label}`, 'success');

    // If the currently selected format was the one being edited, ensure it remains selected
    // (though the id doesn't change, this is good practice if it could)
    if (selectedFormatId === editingFormat.id) {
      setSelectedFormatId(updatedFormat.id);
    }

    handleCancelEdit(); // Reset form and editing state
  };

  const handleAddCustomFormat = () => {
    const { label, widthPx, heightPx, printWidthMm, printHeightMm } = newFormat;
    if (!label.trim() || !widthPx || !heightPx || !printWidthMm || !printHeightMm) {
      addToast('Please fill all custom format fields.', 'error');
      return;
    }

    const newCustomFormat: Format = {
      id: `custom_${Date.now()}`,
      label: label.trim(),
      widthPx: parseInt(widthPx, 10),
      heightPx: parseInt(heightPx, 10),
      printWidthIn: parseFloat(printWidthMm) / 25.4,
      printHeightIn: parseFloat(printHeightMm) / 25.4,
    };

    if (
      isNaN(newCustomFormat.widthPx) || newCustomFormat.widthPx <= 0 ||
      isNaN(newCustomFormat.heightPx) || newCustomFormat.heightPx <= 0 ||
      isNaN(newCustomFormat.printWidthIn) || newCustomFormat.printWidthIn <= 0 ||
      isNaN(newCustomFormat.printHeightIn) || newCustomFormat.printHeightIn <= 0
    ) {
      addToast('Invalid number values for format. All dimensions must be positive.', 'error');
      return;
    }

    setCustomFormats(prev => [...prev, newCustomFormat]);
    addToast(`Added custom format: ${label}`, 'success');
    setNewFormat({
      label: '',
      widthPx: '',
      heightPx: '',
      printWidthMm: '',
      printHeightMm: '',
    });
    setSelectedFormatId(newCustomFormat.id);
  };

  const handleDeleteCustomFormat = (idToDelete: string) => {
    if (editingFormat && editingFormat.id === idToDelete) {
      handleCancelEdit(); // Reset form if deleting the item being edited
    }
    setCustomFormats(prev => prev.filter(f => f.id !== idToDelete));
    if (selectedFormatId === idToDelete) {
      setSelectedFormatId('eu_35x45'); // reset to a default
    }
    addToast('Custom format removed.', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-red-950 p-4 flex items-center justify-center transition-colors duration-300">
      <div className={`max-w-screen-2xl mx-auto ${(showCustomFormatForm || showPrintDialog || showShortcutsDialog) ? 'blur-sm backdrop-blur-sm' : ''} transition-all duration-300`}>
        <Header activeToast={toasts[0] ?? null} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} onOpenShortcutsDialog={() => setShowShortcutsDialog(true)} />

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <Guidelines />
          <CameraView
            isCameraOn={isCameraOn}
            isCameraLoading={isCameraLoading}
            videoRef={videoRef}
            selectedFormat={selectedFormat}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
            onCapturePhoto={capturePhoto}
            onUploadClick={() => fileInputRef.current?.click()}
            onManageFormatsClick={() => setShowCustomFormatForm(true)}
          />
          <ResultPanel
            isProcessingImage={isProcessingImage}
            capturedImage={capturedImage}
            selectedFormat={selectedFormat}
            personName={personName}
            onPersonNameChange={setPersonName}
            watermarkEnabled={watermarkEnabled}
            onWatermarkChange={setWatermarkEnabled}
            onDownload={downloadImage}
            onRetake={retakePhoto}
            onOpenPrintDialog={() => setShowPrintDialog(true)}
          />
        </div>

        <Footer />

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

      <FormatDialog
        isOpen={showCustomFormatForm}
        onClose={handleCloseDialog}
        customFormats={customFormats}
        allFormats={allFormats}
        selectedFormatId={selectedFormatId}
        onSetSelectedFormatId={setSelectedFormatId}
        editingFormat={editingFormat}
        newFormat={newFormat}
        onNewFormatChange={setNewFormat}
        onAdd={handleAddCustomFormat}
        onUpdate={handleUpdateCustomFormat}
        onDelete={handleDeleteCustomFormat}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancelEdit}
      />

      <PrintOptionsDialog
        isOpen={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        onPrint={openPrintPreview}
        photosPerPage={photosPerPage}
        onPhotosPerPageChange={setPhotosPerPage}
        autoFit10x15={autoFit10x15}
        onAutoFitChange={setAutoFit10x15}
        selectedFormat={selectedFormat}
      />

      <ShortcutsDialog
        isOpen={showShortcutsDialog}
        onClose={() => setShowShortcutsDialog(false)}
      />
    </div>
  );
}

export default App;