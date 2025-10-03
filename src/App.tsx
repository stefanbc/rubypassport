import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DownloadOptionsDialog } from "@/components/dialogs/DownloadOptionsDialog";
import { FormatDialog } from "@/components/dialogs/FormatDialog";
import { ImportDialog } from "@/components/dialogs/ImportDialog";
import { InfoDialog } from "@/components/dialogs/InfoDialog";
import { PhotoQueueDialog } from "@/components/dialogs/PhotoQueueDialog";
import { PrintOptionsDialog } from "@/components/dialogs/PrintOptionsDialog";
import { SettingsDialog } from "@/components/dialogs/SettingsDialog";
import { ShortcutsDialog } from "@/components/dialogs/ShortcutsDialog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CameraView } from "@/components/panels/CameraView";
import { Guidelines } from "@/components/panels/Guidelines";
import { ResultPanel } from "@/components/panels/ResultPanel";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ThemeProvider, useTheme } from "@/contexts/ThemeProvider";
import { ToastContainer } from "@/contexts/ToastContainer";
import { useStore } from "@/store";
import { FacingMode, FORMATS, Format, NewFormatState } from "@/types";

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
    // --- Store State and Actions ---
    const {
        customFormats,
        selectedFormatId,
        watermarkEnabled,
        watermarkText,
        baseImage,
        stream,
        isCameraOn,
        facingMode,
        toasts,
        isMobile,
        isTablet,
        activeDialog,
        wizardStep,
        hasVisited,
        setSelectedFormatId,
        setWatermarkEnabled,
        setWizardStep,
        setBaseImage,
        setCapturedImage,
        setHighResBlob,
        setStream,
        setIsCameraOn,
        setIsCameraLoading,
        setFacingMode,
        setIsProcessingImage,
        setIsMobile,
        setIsTablet,
        setIsPWA,
        setIsFullscreen,
        setActiveDialog,
        setHasVisited,
        addToast,
        removeToast,
        retakePhoto: storeRetakePhoto,
        addCustomFormat,
        updateCustomFormat,
        deleteCustomFormat,
        multiCaptureEnabled,
        enqueueToQueue,
        setMultiCaptureEnabled,
        captureQueue,
    } = useStore();
    const { toggleTheme } = useTheme();

    // --- Refs ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageCaptureRef = useRef<ImageCapture | null>(null);

    // --- Local UI State ---
    // State for dialogs and local UI is kept here
    const [editingFormat, setEditingFormat] = useState<Format | null>(null);
    const [newFormat, setNewFormat] = useState<NewFormatState>({
        label: "",
        widthPx: "",
        heightPx: "",
        printWidthMm: "",
        printHeightMm: "",
    });

    const [guidelinesCollapsed, setGuidelinesCollapsed] = useState(true);
    const allFormats: Format[] = [...FORMATS, ...customFormats];
    const selectedFormat =
        allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];
    const wizardStepIndex = { guidelines: 0, camera: 1, result: 2 }[wizardStep];
    const { t } = useTranslation();

    // Wrapper to match previous signature
    const retakePhoto = useCallback(() => {
        storeRetakePhoto(isMobile);
    }, [storeRetakePhoto, isMobile]);

    useEffect(() => {
        // On first visit, show the info dialog.
        if (!hasVisited) {
            const timer = setTimeout(() => {
                setActiveDialog("info");
                setHasVisited(true);
            }, 500); // Small delay to allow the app to render
            return () => clearTimeout(timer);
        }
    }, [hasVisited, setActiveDialog, setHasVisited]);

    useEffect(() => {
        const checkDeviceSize = () => {
            const width = window.innerWidth;
            const newIsMobile = width < 768;
            // Consider devices up to 1280px as tablets to correctly handle
            // landscape orientation and larger tablets like the iPad Pro.
            const newIsTablet = width >= 768 && width < 1280;
            setIsMobile(newIsMobile);
            setIsTablet(newIsTablet);
            setGuidelinesCollapsed(newIsTablet); // Collapse on tablet, expand on desktop
        };
        checkDeviceSize();
        window.addEventListener("resize", checkDeviceSize);
        return () => window.removeEventListener("resize", checkDeviceSize);
    }, [setIsMobile, setIsTablet]);

    useEffect(() => {
        const checkPWA = () => {
            const isStandalone = window.matchMedia(
                "(display-mode: standalone)",
            ).matches;
            const isFullscreen = window.matchMedia(
                "(display-mode: fullscreen)",
            ).matches;
            setIsPWA(isStandalone || isFullscreen);
        };
        checkPWA();
        const standaloneMatcher = window.matchMedia(
            "(display-mode: standalone)",
        );
        const fullscreenMatcher = window.matchMedia(
            "(display-mode: fullscreen)",
        );
        standaloneMatcher.addEventListener("change", checkPWA);
        fullscreenMatcher.addEventListener("change", checkPWA);

        return () => {
            standaloneMatcher.removeEventListener("change", checkPWA);
            fullscreenMatcher.removeEventListener("change", checkPWA);
        };
    }, [setIsPWA]);

    // Effect to manage the toast queue, showing one at a time.
    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                removeToast();
            }, toasts[0].duration);

            return () => clearTimeout(timer);
        }
    }, [toasts, removeToast]);

    // Effect to show toasts when online/offline status changes.
    useEffect(() => {
        const handleOnline = () => {
            addToast(t("toasts.backOnline"), "success");
        };

        const handleOffline = () => {
            addToast(t("toasts.offline"), "info");
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [addToast, t]);

    const applyWatermark = useCallback(
        (
            context: CanvasRenderingContext2D,
            targetWidth: number,
            targetHeight: number,
            text: string,
        ) => {
            if (!text.trim()) return;
            context.save();
            const diagonalRadians = (-25 * Math.PI) / 180;
            const baseSize = Math.min(targetWidth, targetHeight);
            const fontSize = Math.max(14, Math.floor(baseSize * 0.075));
            context.font = `600 ${fontSize}px 'EB Garamond', 'Garamond', 'Times New Roman', serif`;
            context.fillStyle = "rgba(255,255,255,0.07)";
            context.strokeStyle = "rgba(255,255,255,0.06)";
            context.lineWidth = Math.max(0.4, Math.floor(fontSize * 0.02));
            context.textAlign = "center";
            context.textBaseline = "middle";

            // Create a tiled pattern of watermark text sized to avoid overlaps
            const metrics = context.measureText(text);
            const textWidth = Math.max(metrics.width, fontSize * 6);
            const stepX = textWidth + fontSize * 1.25; // horizontal spacing
            const stepY = fontSize * 2.6; // vertical spacing

            context.translate(targetWidth / 2, targetHeight / 2);
            context.rotate(diagonalRadians);
            // Draw staggered grid centered, covering full area
            let row = 0;
            for (let y = -targetHeight; y <= targetHeight; y += stepY) {
                const xOffset = row % 2 === 0 ? 0 : stepX / 2;
                for (let x = -targetWidth; x <= targetWidth; x += stepX) {
                    context.fillText(text, x + xOffset, y);
                    context.strokeText(text, x + xOffset, y);
                }
                row++;
            }
            context.restore();
        },
        [],
    );

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            });
            setStream(null);
            setIsCameraOn(false);
            imageCaptureRef.current = null;
        }
    }, [stream, setStream, setIsCameraOn]);

    const startCamera = useCallback(
        async (modeToSet: FacingMode = facingMode) => {
            try {
                addToast(t("toasts.startingCamera"), "info");
                setIsCameraLoading(true);

                // Get a stream with basic constraints first to access track capabilities.
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: modeToSet },
                    audio: false,
                });

                const videoTrack = mediaStream.getVideoTracks()[0];
                if (!videoTrack) {
                    throw new Error("No video track found in the stream.");
                }

                const capabilities = videoTrack.getCapabilities();
                if (capabilities.width?.max && capabilities.height?.max) {
                    addToast(
                        t("toasts.maxCameraResolution", {
                            width: capabilities.width.max,
                            height: capabilities.height.max,
                        }),
                        "info",
                        1500,
                    );
                }

                // Apply more specific constraints for the best quality and aspect ratio.
                const aspectRatio =
                    selectedFormat.widthPx / selectedFormat.heightPx;
                const idealWidth = capabilities.width?.max || 4096; // Fallback to 4096

                const newConstraints: MediaTrackConstraints = {
                    width: { ideal: idealWidth },
                    aspectRatio: { ideal: aspectRatio },
                };

                await videoTrack.applyConstraints(newConstraints);

                console.log("Got media stream:", mediaStream);
                setStream(mediaStream);
                setFacingMode(modeToSet);
                setIsCameraOn(true);

                const settings = videoTrack.getSettings();
                if (settings.width && settings.height) {
                    addToast(
                        t("toasts.cameraStream", {
                            width: settings.width,
                            height: settings.height,
                        }),
                        "info",
                        1500,
                    );
                }

                if ("ImageCapture" in window) {
                    try {
                        imageCaptureRef.current = new ImageCapture(videoTrack);
                        addToast(t("toasts.highResAvailable"), "info", 1500);
                    } catch (e) {
                        console.error("Could not create ImageCapture:", e);
                        imageCaptureRef.current = null;
                    }
                } else {
                    addToast(t("toasts.highResNotSupported"), "info", 1500);
                }
            } catch (err) {
                addToast(
                    t("toasts.cameraError", {
                        message:
                            err instanceof Error
                                ? err.message
                                : "Unknown error",
                    }),
                    "error",
                );
                setIsCameraOn(false);
                setIsCameraLoading(false);
            }
        },
        [
            addToast,
            selectedFormat,
            facingMode,
            setStream,
            setFacingMode,
            setIsCameraOn,
            setIsCameraLoading,
            t,
        ],
    );

    const switchCamera = useCallback(async () => {
        const newMode = facingMode === "user" ? "environment" : "user";
        stopCamera();
        setTimeout(() => startCamera(newMode), 100);
    }, [facingMode, stopCamera, startCamera]);

    const capturePhoto = useCallback(async () => {
        setIsProcessingImage(true);
        setHighResBlob(null);
        // High-res capture with ImageCapture API if available
        if (imageCaptureRef.current) {
            try {
                addToast(t("toasts.capturingHighRes"), "info", 1000);
                const blob = await imageCaptureRef.current.takePhoto();
                setHighResBlob(blob);
                const imageUrl = URL.createObjectURL(blob);

                const img = new Image();
                img.onload = () => {
                    if (!canvasRef.current) {
                        setIsProcessingImage(false);
                        return;
                    }

                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");
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
                        sourceX,
                        sourceY,
                        sourceWidth,
                        sourceHeight,
                        0,
                        0,
                        targetWidth,
                        targetHeight,
                    );

                    const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);
                    setBaseImage(imageDataUrl);
                    if (isMobile) {
                        setWizardStep("result");
                    }
                    addToast(t("toasts.photoCaptured"), "success");
                    URL.revokeObjectURL(imageUrl);
                };
                img.onerror = () => {
                    addToast(t("toasts.photoCaptureFailed"), "error");
                    URL.revokeObjectURL(imageUrl);
                    setIsProcessingImage(false);
                };
                img.src = imageUrl;
                return; // Exit after handling ImageCapture
            } catch (e) {
                const error = e as Error;
                addToast(
                    t("toasts.highResCaptureFailed", {
                        message: error.message,
                    }),
                    "error",
                );
            }
        }

        // Fallback for browsers without ImageCapture or if it fails
        if (!videoRef.current || !canvasRef.current) {
            setIsProcessingImage(false);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

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
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            targetWidth,
            targetHeight,
        );

        const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);
        setBaseImage(imageDataUrl);
        if (isMobile) {
            setWizardStep("result");
        }
        addToast(t("toasts.photoFromStream"), "success");
    }, [
        setIsProcessingImage,
        setHighResBlob,
        selectedFormat.widthPx,
        selectedFormat.heightPx,
        setBaseImage,
        isMobile,
        addToast,
        t,
        setWizardStep,
    ]);

    const downloadProcessedImage = useCallback(() => {
        const { capturedImage, personName, selectedFormatId, customFormats } =
            useStore.getState();
        if (!capturedImage) return;

        const allFormats = [...FORMATS, ...customFormats];
        const selectedFormat =
            allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];

        const link = document.createElement("a");
        const safeName = personName
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_-]/g, "");
        const namePart = safeName ? `${safeName}-` : "";
        link.download = `${namePart}passport-${selectedFormat.id}-${selectedFormat.widthPx}x${selectedFormat.heightPx}-${Date.now()}.jpg`;
        link.href = capturedImage;
        link.click();
        addToast(t("toasts.processedDownloaded"), "success");
    }, [addToast, t]);

    const downloadHighResImage = useCallback(() => {
        const { highResBlob, personName } = useStore.getState();
        if (!highResBlob) return;

        const link = document.createElement("a");
        const safeName = personName
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_-]/g, "");
        const namePart = safeName ? `${safeName}-` : "";
        const extension = highResBlob.type.split("/")[1] || "jpg";
        link.download = `${namePart}passport-original-${Date.now()}.${extension}`;
        link.href = URL.createObjectURL(highResBlob);
        link.click();
        URL.revokeObjectURL(link.href);
        addToast(t("toasts.originalDownloaded"), "success");
    }, [addToast, t]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                addToast(
                    t("toasts.fullscreenError", { message: err.message }),
                    "error",
                );
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, [addToast, t]);

    const handleCancelEdit = useCallback(() => {
        setEditingFormat(null);
        setNewFormat({
            label: "",
            widthPx: "",
            heightPx: "",
            printWidthMm: "",
            printHeightMm: "",
        });
    }, []);

    const handleCloseDialog = useCallback(() => {
        setActiveDialog(null);
        handleCancelEdit();
    }, [handleCancelEdit, setActiveDialog]);

    const handleFullscreenChange = useCallback(() => {
        setIsFullscreen(!!document.fullscreenElement);
    }, [setIsFullscreen]);

    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
    }, [handleFullscreenChange]);

    useEffect(() => {
        // On mobile, automatically stop the camera if we navigate away from the camera step.
        if (isMobile && wizardStep !== "camera" && isCameraOn) {
            stopCamera();
        }
    }, [wizardStep, isMobile, isCameraOn, stopCamera]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping =
                ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
                target.isContentEditable;

            if (e.key === "Escape") {
                if (activeDialog) {
                    setActiveDialog(null);
                    return;
                }
                if (isTyping) (e.target as HTMLElement).blur();
                return;
            }

            if (isTyping) return;

            // No other shortcuts if a dialog is open, except for Escape which is handled above.
            if (activeDialog) {
                return;
            }

            // Ignore single-key shortcuts if modifier keys are pressed.
            // This prevents conflicts with browser shortcuts like Cmd+R (reload).
            if (e.metaKey || e.ctrlKey || e.altKey) {
                return;
            }

            switch (e.key) {
                case "?":
                    setActiveDialog("shortcuts");
                    break;
                case "c":
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    isCameraOn ? stopCamera() : void startCamera();
                    break;
                case " ":
                    if (isCameraOn) {
                        e.preventDefault(); // Prevent page scroll
                        capturePhoto();
                    }
                    break;
                case "u":
                    if (!isCameraOn) setActiveDialog("import");
                    break;
                case "d":
                    if (useStore.getState().capturedImage)
                        setActiveDialog("download");
                    break;
                case "r":
                    if (useStore.getState().capturedImage) retakePhoto();
                    break;
                case "w":
                    if (useStore.getState().capturedImage)
                        setWatermarkEnabled(
                            !useStore.getState().watermarkEnabled,
                        );
                    break;
                case "p":
                    if (
                        useStore.getState().capturedImage ||
                        useStore.getState().captureQueue.length > 0
                    )
                        setActiveDialog("print");
                    break;
                case "f":
                    setActiveDialog("customFormat");
                    break;
                case "i":
                    setActiveDialog("info");
                    break;
                case "t":
                    toggleTheme();
                    break;
                case "b":
                    setMultiCaptureEnabled(
                        !useStore.getState().multiCaptureEnabled,
                    );
                    break;
                case "s":
                    setActiveDialog("settings");
                    break;
                case "Enter":
                    toggleFullscreen();
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [
        isCameraOn,
        activeDialog,
        startCamera,
        stopCamera,
        capturePhoto,
        retakePhoto,
        toggleFullscreen,
        setActiveDialog,
        setWatermarkEnabled,
        setMultiCaptureEnabled,
        toggleTheme,
    ]);

    const lastQueuedBaseImageRef = useRef<string | null>(null);
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
            const context = canvas.getContext("2d");
            if (!context) {
                setIsProcessingImage(false);
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            if (watermarkEnabled) {
                applyWatermark(context, img.width, img.height, watermarkText);
            }

            const finalDataUrl = canvas.toDataURL("image/jpeg", 1.0);
            setCapturedImage(finalDataUrl);
            if (
                multiCaptureEnabled &&
                baseImage !== lastQueuedBaseImageRef.current
            ) {
                enqueueToQueue(finalDataUrl);
                lastQueuedBaseImageRef.current = baseImage; // Avoid re-queuing on re-render
                addToast(
                    t("toasts.addedToQueue", {
                        count: captureQueue.length + 1,
                    }),
                    "success",
                    1000,
                );
            }
            setIsProcessingImage(false);
        };
        img.onerror = () => {
            addToast(t("toasts.imageLoadFailed"), "error");
            setIsProcessingImage(false);
        };
        img.src = baseImage; // This triggers the onload
    }, [
        baseImage,
        watermarkEnabled,
        watermarkText,
        multiCaptureEnabled,
        enqueueToQueue,
        applyWatermark,
        addToast,
        setIsProcessingImage,
        setCapturedImage,
        t,
        captureQueue.length,
    ]);

    useEffect(() => {
        return () => {
            if (stream) {
                // Ensure camera is off on unmount
                stream.getTracks().forEach((track: MediaStreamTrack) => {
                    track.stop();
                });
            }
        };
    }, [stream]);

    // Handle video element setup when stream is available
    useEffect(() => {
        if (stream && videoRef.current) {
            console.log("Setting video source...");
            videoRef.current.srcObject = stream;

            const video = videoRef.current;

            // Add multiple event listeners to ensure video starts
            const handleLoadedMetadata = async () => {
                console.log("Video metadata loaded");
                try {
                    await video.play();
                    console.log("Video playing");
                    setIsCameraLoading(false);
                } catch (playError: unknown) {
                    if (playError instanceof Error) {
                        addToast(
                            t("toasts.videoPlaybackErrorMessage", {
                                message: playError.message,
                            }),
                            "error",
                        );
                    } else {
                        addToast(t("toasts.videoPlaybackError"), "error");
                    }
                }
            };

            const handleCanPlay = () => {
                console.log("Video can play");
            };

            video.addEventListener("loadedmetadata", handleLoadedMetadata);
            video.addEventListener("canplay", handleCanPlay);

            // Force play attempt
            video.play().catch(() => {
                addToast(t("toasts.cameraPermission"), "info");
            });

            // Cleanup event listeners
            return () => {
                video.removeEventListener(
                    "loadedmetadata",
                    handleLoadedMetadata,
                );
                video.removeEventListener("canplay", handleCanPlay);
            };
        }
    }, [stream, addToast, setIsCameraLoading, t]);

    const handleImageCropped = useCallback(
        (originalFile: File, croppedDataUrl: string) => {
            setHighResBlob(originalFile);
            setBaseImage(croppedDataUrl); // This will trigger the processing effect
            setActiveDialog(null);
            if (isMobile) {
                setWizardStep("result");
            }
            addToast(t("toasts.imageImportSuccess"), "success");
        },
        [
            setHighResBlob,
            setBaseImage,
            setActiveDialog,
            isMobile,
            addToast,
            t,
            setWizardStep,
        ],
    );

    const openPrintPreview = useCallback(() => {
        const {
            capturedImage,
            personName,
            selectedFormatId,
            customFormats,
            photosPerPage,
            captureQueue,
        } = useStore.getState();

        if (!capturedImage && captureQueue.length === 0) return;
        addToast(t("toasts.printPreview"), "info");
        const printWin = window.open("", "_blank");
        if (!printWin) {
            addToast(t("toasts.printWindowError"), "error");
            return;
        }
        const allFormats = [...FORMATS, ...customFormats];
        const selectedFormat =
            allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];
        const widthIn = selectedFormat.printWidthMm / 25.4;
        const heightIn = selectedFormat.printHeightMm / 25.4;
        const gapIn = 0.1; // equal row/column gap
        const cutMarkLengthIn = gapIn / 2;
        const cutMarkOffsetIn = -cutMarkLengthIn;

        const totalImages = photosPerPage;
        const doc = printWin.document;
        const html = doc.documentElement;
        const head = doc.createElement("head");
        const body = doc.createElement("body");

        const metaCharset = doc.createElement("meta");
        metaCharset.setAttribute("charset", "utf-8");
        const metaViewport = doc.createElement("meta");
        metaViewport.name = "viewport";
        metaViewport.content = "width=device-width, initial-scale=1";
        const title = doc.createElement("title");
        title.textContent = personName
            ? t("components.app.printPreviewTitleWithName", {
                  name: personName,
              })
            : t("components.app.printPreviewTitle");
        const style = doc.createElement("style");
        style.textContent = `
      @page { margin: 0.5in; }
      html, body { height: 100%; }
      body { background: #fff; margin: 0; display: flex; align-items: center; justify-content: center; }
      .sheet {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(${widthIn}in, ${widthIn}in));
        grid-auto-rows: ${heightIn}in;
        gap: ${gapIn}in; /* equal gap for rows and columns */
        align-content: start;
        justify-content: start;
        padding: 0;
        box-sizing: border-box;
        width: 100%; height: 100%;
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

        const sheet = doc.createElement("div");
        sheet.className = "sheet";
        const imagesSource =
            captureQueue.length > 0
                ? captureQueue
                : capturedImage
                  ? [capturedImage]
                  : [];
        const countToRender = totalImages;
        for (let i = 0; i < countToRender; i++) {
            const photoContainer = doc.createElement("div");
            photoContainer.className = "photo-container";

            const img = doc.createElement("img");
            img.className = "photo";
            img.src = imagesSource[i % imagesSource.length];
            img.alt = t("components.app.passportPortraitAlt");
            photoContainer.appendChild(img);
            photoContainer.appendChild(doc.createElement("span"));
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
                    if (loaded === images.length)
                        setTimeout(() => printWin.print(), 100);
                } else {
                    im.onload = () => {
                        loaded++;
                        if (loaded === images.length)
                            setTimeout(() => printWin.print(), 100);
                    };
                    im.onerror = () => {
                        loaded++;
                        if (loaded === images.length)
                            setTimeout(() => printWin.print(), 100);
                    };
                }
            });
        };
        waitForImages();
    }, [addToast, t]);

    const handleEditClick = (formatToEdit: Format) => {
        setEditingFormat(formatToEdit);
        setNewFormat({
            label: formatToEdit.label,
            widthPx: String(formatToEdit.widthPx),
            heightPx: String(formatToEdit.heightPx),
            printWidthMm: String(formatToEdit.printWidthMm),
            printHeightMm: String(formatToEdit.printHeightMm),
        });
    };

    const handleUpdateCustomFormat = () => {
        if (!editingFormat) return;

        const { label, widthPx, heightPx, printWidthMm, printHeightMm } =
            newFormat;
        if (
            !label.trim() ||
            !widthPx ||
            !heightPx ||
            !printWidthMm ||
            !printHeightMm
        ) {
            addToast(t("dialogs.format.errorAllFields"), "error");
            return;
        }

        const updatedFormat: Format = {
            ...editingFormat,
            label: label.trim(),
            widthPx: parseInt(widthPx, 10),
            heightPx: parseInt(heightPx, 10),
            printWidthMm: parseFloat(printWidthMm),
            printHeightMm: parseFloat(printHeightMm),
        };
        if (
            Number.isNaN(updatedFormat.widthPx) ||
            updatedFormat.widthPx <= 0 ||
            Number.isNaN(updatedFormat.heightPx) ||
            updatedFormat.heightPx <= 0 ||
            Number.isNaN(updatedFormat.printWidthMm) ||
            updatedFormat.printWidthMm <= 0 ||
            Number.isNaN(updatedFormat.printHeightMm) ||
            updatedFormat.printHeightMm <= 0
        ) {
            addToast(t("dialogs.format.errorInvalidNumber"), "error");
            return;
        }

        updateCustomFormat(updatedFormat);

        // If the currently selected format was the one being edited, ensure it remains selected
        // (though the id doesn't change, this is good practice if it could)
        if (selectedFormatId === editingFormat.id) {
            setSelectedFormatId(updatedFormat.id);
        }

        handleCancelEdit(); // Reset form and editing state
    };

    const handleAddCustomFormat = () => {
        const { label, widthPx, heightPx, printWidthMm, printHeightMm } =
            newFormat;
        if (
            !label.trim() ||
            !widthPx ||
            !heightPx ||
            !printWidthMm ||
            !printHeightMm
        ) {
            addToast(t("dialogs.format.errorAllFields"), "error");
            return;
        }

        const newCustomFormat: Omit<Format, "id"> = {
            label: label.trim(),
            widthPx: parseInt(widthPx, 10),
            heightPx: parseInt(heightPx, 10),
            printWidthMm: parseFloat(printWidthMm),
            printHeightMm: parseFloat(printHeightMm),
        };

        if (
            Number.isNaN(newCustomFormat.widthPx) ||
            newCustomFormat.widthPx <= 0 ||
            Number.isNaN(newCustomFormat.heightPx) ||
            newCustomFormat.heightPx <= 0 ||
            Number.isNaN(newCustomFormat.printWidthMm) ||
            newCustomFormat.printWidthMm <= 0 ||
            Number.isNaN(newCustomFormat.printHeightMm) ||
            newCustomFormat.printHeightMm <= 0
        ) {
            addToast(t("dialogs.format.errorInvalidNumber"), "error");
            return;
        }

        addCustomFormat(newCustomFormat);
        setNewFormat({
            label: "",
            widthPx: "",
            heightPx: "",
            printWidthMm: "",
            printHeightMm: "",
        });
    };

    const handleDeleteCustomFormat = (idToDelete: string) => {
        if (editingFormat && editingFormat.id === idToDelete)
            handleCancelEdit();
        deleteCustomFormat(idToDelete);
    };

    return (
        <div
            className={`h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-red-950 flex flex-col ${!isMobile ? "justify-center items-center" : ""}`}
        >
            <div
                className={`max-w-screen-2xl mx-auto w-full flex flex-col p-4 md:p-6 lg:p-8 min-h-0 ${isMobile ? "flex-grow" : ""} ${activeDialog ? "blur-sm backdrop-blur-sm" : ""} transition-all duration-300`}
            >
                <Header
                    onToggleFullscreen={toggleFullscreen}
                    onManageFormatsClick={() => setActiveDialog("customFormat")}
                    selectedFormatLabel={selectedFormat.label}
                />

                {isMobile ? (
                    <div className="w-full flex-grow flex flex-col pb-2 min-h-0">
                        {/* Step Indicator */}
                        <div className="flex justify-center items-center gap-2 mb-4">
                            {["guidelines", "camera", "result"].map(
                                (label, index) => (
                                    <div
                                        key={label}
                                        className="flex flex-col items-center gap-1 text-center w-1/3"
                                    >
                                        <div
                                            className={`w-full h-1.5 rounded-full transition-colors ${wizardStepIndex >= index ? "bg-red-600" : "bg-gray-300 dark:bg-zinc-700"}`}
                                        />
                                    </div>
                                ),
                            )}
                        </div>

                        {/* Wizard Content */}
                        <div className="relative w-full overflow-hidden flex-grow">
                            <div
                                className="flex w-[300%] h-full transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${wizardStepIndex * (100 / 3)}%)`,
                                }}
                            >
                                {/* Guidelines Step */}
                                <div className="w-1/3 px-1 flex flex-col h-full min-h-0">
                                    <div className="flex-grow overflow-y-auto">
                                        <Guidelines />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setWizardStep("camera")}
                                        className="mt-4 w-full bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors cursor-pointer shadow-lg font-semibold"
                                    >
                                        {t("common.continue")}
                                    </button>
                                </div>

                                {/* Camera Step */}
                                <div className="w-1/3 px-1 h-full min-h-0">
                                    <CameraView
                                        videoRef={videoRef}
                                        onStartCamera={() => startCamera()}
                                        onStopCamera={stopCamera}
                                        onCapturePhoto={capturePhoto}
                                        onImportClick={() =>
                                            setActiveDialog("import")
                                        }
                                        onBack={() =>
                                            setWizardStep("guidelines")
                                        }
                                        onSwitchCamera={switchCamera}
                                    />
                                </div>

                                {/* Result Step */}
                                <div className="w-1/3 px-1 h-full min-h-0">
                                    <ResultPanel
                                        onDownload={() =>
                                            setActiveDialog("download")
                                        }
                                        onRetake={retakePhoto}
                                        onOpenPrintDialog={() =>
                                            setActiveDialog("print")
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative flex-grow min-h-0">
                        {/* Main Grid for content */}
                        <div
                            className={`grid ${isTablet ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4 items-stretch h-full`}
                        >
                            {!isTablet && <Guidelines />}

                            <div className="relative h-full min-h-0">
                                {isTablet && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setGuidelinesCollapsed(
                                                !guidelinesCollapsed,
                                            )
                                        }
                                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
                                        title={
                                            guidelinesCollapsed
                                                ? t("tooltips.showGuidelines")
                                                : t("tooltips.hideGuidelines")
                                        }
                                    >
                                        {guidelinesCollapsed ? (
                                            <PanelLeftOpen
                                                size={20}
                                                className="text-gray-600 dark:text-gray-300"
                                            />
                                        ) : (
                                            <PanelLeftClose
                                                size={20}
                                                className="text-gray-600 dark:text-gray-300"
                                            />
                                        )}
                                    </button>
                                )}
                                <CameraView
                                    videoRef={videoRef}
                                    onStartCamera={() => startCamera()}
                                    onStopCamera={stopCamera}
                                    onCapturePhoto={capturePhoto}
                                    onImportClick={() =>
                                        setActiveDialog("import")
                                    }
                                    onSwitchCamera={switchCamera}
                                />
                            </div>

                            <ResultPanel
                                onDownload={() => setActiveDialog("download")}
                                onRetake={retakePhoto}
                                onOpenPrintDialog={() =>
                                    setActiveDialog("print")
                                }
                            />
                        </div>

                        {/* Guidelines as an overlay on tablet */}
                        {isTablet && (
                            <>
                                {/* Backdrop for overlay */}
                                <div
                                    className={`absolute inset-0 z-10 blur-sm backdrop-blur-sm transition-opacity duration-300 ease-in-out
                    ${guidelinesCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}
                  `}
                                    onClick={() => setGuidelinesCollapsed(true)}
                                    aria-hidden="true"
                                />
                                {/* Sliding Panel */}
                                <div
                                    className={`absolute top-0 left-0 h-full z-20 w-96 max-w-[90vw] transition-transform duration-300 ease-in-out
                    ${guidelinesCollapsed ? "-translate-x-full -ml-4" : "translate-x-0 ml-0"}
                  `}
                                >
                                    <Guidelines />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!isMobile && <Footer />}

                {/* Hidden canvas for photo processing */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            <PhotoQueueDialog
                isOpen={activeDialog === "photoQueue"}
                onClose={handleCloseDialog}
            />

            <ToastContainer activeToast={toasts[0] ?? null} />

            <FormatDialog
                isOpen={activeDialog === "customFormat"}
                onClose={handleCloseDialog}
                editingFormat={editingFormat}
                newFormat={newFormat}
                onNewFormatChange={setNewFormat}
                onAdd={handleAddCustomFormat}
                onUpdate={handleUpdateCustomFormat}
                onDelete={handleDeleteCustomFormat}
                onEditClick={handleEditClick}
                onCancelEdit={handleCancelEdit}
            />

            <ImportDialog
                isOpen={activeDialog === "import"}
                onClose={() => setActiveDialog(null)}
                onImageCropped={handleImageCropped}
            />

            <PrintOptionsDialog
                isOpen={activeDialog === "print"}
                onClose={() => setActiveDialog(null)}
                onPrint={openPrintPreview}
            />

            <DownloadOptionsDialog
                isOpen={activeDialog === "download"}
                onClose={() => setActiveDialog(null)}
                onDownloadProcessed={downloadProcessedImage}
                onDownloadHighRes={downloadHighResImage}
            />

            <ShortcutsDialog
                isOpen={activeDialog === "shortcuts"}
                onClose={() => setActiveDialog(null)}
            />

            <InfoDialog
                isOpen={activeDialog === "info"}
                onClose={() => setActiveDialog(null)}
            />

            <ConfirmationDialog
                isOpen={activeDialog === "confirmRetake"}
                onClose={() => setActiveDialog(null)}
                onConfirm={retakePhoto}
                title={t("dialogs.confirmation.retake_title")}
                description={t("dialogs.confirmation.retake_description")}
                confirmText={t("components.panels.result.retake_button")}
                cancelText={t("common.cancel")}
            />

            <SettingsDialog
                isOpen={activeDialog === "settings"}
                onClose={() => setActiveDialog(null)}
            />
        </div>
    );
}

export default App;
