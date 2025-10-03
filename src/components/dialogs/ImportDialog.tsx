import { Check, RotateCcw, UploadCloud, ZoomIn, ZoomOut } from "lucide-react";
import {
    ChangeEvent,
    DragEvent,
    MouseEvent as ReactMouseEvent,
    TouchEvent as ReactTouchEvent,
    WheelEvent as ReactWheelEvent,
    SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Dialog, Input, Slider } from "@/components/ui";
import { useStore } from "@/store";
import { FORMATS } from "@/types";

interface ImportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImageCropped: (originalFile: File, croppedDataUrl: string) => void;
}

export function ImportDialog({
    isOpen,
    onClose,
    onImageCropped,
}: ImportDialogProps) {
    const { selectedFormatId, customFormats, addToast, isMobile } = useStore();
    const { t } = useTranslation();
    const allFormats = [...FORMATS, ...customFormats];
    const selectedFormat =
        allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0, imgX: 0, imgY: 0 });
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    });
    const panStartedOnCropper = useRef(false);

    const imageRef = useRef<HTMLImageElement>(null);
    const cropContainerRef = useRef<HTMLDivElement>(null);

    // Guide constants from CameraView
    const guideOvalWidthPct = 42;
    const guideOvalHeightPct = 64;
    const innerOvalWidthPct = Math.round(guideOvalWidthPct * 0.72);
    const innerOvalHeightPct = Math.round(guideOvalHeightPct * 0.8);
    const eyeLineTopPct = 45;

    const handleReset = useCallback(() => {
        setImageSrc(null);
        setOriginalFile(null);
        setPosition({ x: 0, y: 0 });
        setZoom(1);
        dragCounter.current = 0;
        setIsDragging(false);
        panStartedOnCropper.current = false;
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    useEffect(() => {
        // Reset the state when the dialog is closed, so it's fresh for the next import.
        if (!isOpen) {
            setTimeout(() => {
                handleReset();
            }, 300); // Allow closing animation to finish before resetting state
        }
    }, [isOpen, handleReset]);

    const handleFile = useCallback(
        (file: File | null | undefined) => {
            if (!file) return;
            if (!file.type.startsWith("image/")) {
                addToast("Please select a valid image file.", "error");
                return;
            }

            setOriginalFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        },
        [addToast],
    );

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

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;
            handleFile(e.dataTransfer.files?.[0]);
        },
        [handleFile],
    );

    const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
    };

    const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setZoom(1);
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
        });

        if (cropContainerRef.current) {
            const { clientWidth: cropW, clientHeight: cropH } =
                cropContainerRef.current;
            const imageAspectRatio = img.naturalWidth / img.naturalHeight;
            const cropAspectRatio =
                selectedFormat.widthPx / selectedFormat.heightPx;

            let imgDisplayW: number, imgDisplayH: number;
            if (imageAspectRatio > cropAspectRatio) {
                imgDisplayH = cropH;
                imgDisplayW = imgDisplayH * imageAspectRatio;
            } else {
                imgDisplayW = cropW;
                imgDisplayH = imgDisplayW / imageAspectRatio;
            }
            setPosition({
                x: (cropW - imgDisplayW) / 2,
                y: (cropH - imgDisplayH) / 2,
            });
        }
    };

    const getImageStyle = (): React.CSSProperties => {
        if (!imageDimensions.width || !cropContainerRef.current) return {};
        const imageAspectRatio = imageDimensions.width / imageDimensions.height;
        const cropAspectRatio =
            selectedFormat.widthPx / selectedFormat.heightPx;
        return imageAspectRatio > cropAspectRatio
            ? { height: "100%", width: "auto" }
            : { width: "100%", height: "auto" };
    };

    const handleZoomChange = (newZoom: number) => {
        if (!cropContainerRef.current || !imageRef.current) return;

        const { clientWidth: cropW, clientHeight: cropH } =
            cropContainerRef.current;
        const { clientWidth: imgW, clientHeight: imgH } = imageRef.current;

        // Zoom to the center of the crop area
        const newPosX = cropW / 2 - (cropW / 2 - position.x) * (newZoom / zoom);
        const newPosY = cropH / 2 - (cropH / 2 - position.y) * (newZoom / zoom);

        // Clamp the new position within the new boundaries
        const clampedX = Math.max(cropW - imgW * newZoom, Math.min(0, newPosX));
        const clampedY = Math.max(cropH - imgH * newZoom, Math.min(0, newPosY));

        setPosition({ x: clampedX, y: clampedY });
        setZoom(newZoom);
    };

    const handleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const newZoom = Math.max(1, Math.min(3, zoom - e.deltaY * 0.005));
        if (newZoom !== zoom) handleZoomChange(newZoom);
    };

    const handlePanStart = (
        e: ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement>,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        panStartedOnCropper.current = true;
        setIsPanning(true);
        const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
        setPanStart({
            x: clientX,
            y: clientY,
            imgX: position.x,
            imgY: position.y,
        });
    };

    useEffect(() => {
        const handlePanEnd = () => {
            setIsPanning(false);
            // After a pan, we want to prevent the next click (which happens on mouseup)
            // from closing the dialog if it lands on the backdrop.
            // We reset the flag after a tick, so the click event handler on the backdrop
            // can check it, but subsequent clicks will behave normally.
            setTimeout(() => {
                panStartedOnCropper.current = false;
            }, 0);
        };

        const handlePanMove = (e: MouseEvent | TouchEvent) => {
            // Listener is only active when panning, so no need for isPanning check
            if (!imageRef.current || !cropContainerRef.current) return;

            // Prevent page from scrolling on touch devices
            if (e.cancelable) e.preventDefault();

            const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
            const dx = clientX - panStart.x;
            const dy = clientY - panStart.y;
            const { clientWidth: cropW, clientHeight: cropH } =
                cropContainerRef.current;
            const { clientWidth: imgW, clientHeight: imgH } = imageRef.current;

            const newX = panStart.imgX + dx;
            const newY = panStart.imgY + dy;

            setPosition({
                x: Math.max(cropW - imgW * zoom, Math.min(0, newX)),
                y: Math.max(cropH - imgH * zoom, Math.min(0, newY)),
            });
        };

        if (isPanning) {
            window.addEventListener("mousemove", handlePanMove);
            window.addEventListener("touchmove", handlePanMove, {
                passive: false,
            });
            window.addEventListener("mouseup", handlePanEnd);
            window.addEventListener("touchend", handlePanEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handlePanMove);
            window.removeEventListener("touchmove", handlePanMove);
            window.removeEventListener("mouseup", handlePanEnd);
            window.removeEventListener("touchend", handlePanEnd);
        };
    }, [isPanning, panStart, zoom]);

    const handleBackdropClick = () => {
        // If a pan just ended (the flag is true), we don't close the dialog.
        // The flag will be reset by the timeout in the pan-end effect.
        if (panStartedOnCropper.current) {
            return;
        }
        onClose();
    };

    const handleCrop = () => {
        if (!imageRef.current || !cropContainerRef.current || !originalFile)
            return;
        const img = imageRef.current;
        const cropContainer = cropContainerRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = selectedFormat.widthPx;
        canvas.height = selectedFormat.heightPx;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            addToast("Could not process image.", "error");
            return;
        }
        // The scale of the un-zoomed image element relative to its natural size.
        // This is consistent for both width and height because aspect ratio is maintained.
        const displayScale = img.clientWidth / img.naturalWidth;

        // The total scale from the natural image size to the final zoomed-and-displayed size.
        const totalScale = displayScale * zoom;

        // Map the crop area (the viewport) back to the natural image's coordinates for `drawImage`.
        // `position` is the top-left of the transformed image relative to the crop container.
        // We divide by the total scale to convert from screen pixels to source image pixels.
        const sx = -position.x / totalScale;
        const sy = -position.y / totalScale;
        const sWidth = cropContainer.clientWidth / totalScale;
        const sHeight = cropContainer.clientHeight / totalScale;

        ctx.drawImage(
            img,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            canvas.width,
            canvas.height,
        );
        const croppedDataUrl = canvas.toDataURL("image/jpeg", 1.0);
        onImageCropped(originalFile, croppedDataUrl);
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleBackdropClick}
            title={
                imageSrc
                    ? t("dialogs.import.title_reposition")
                    : t("dialogs.import.title_import")
            }
            icon={UploadCloud}
            closeAriaLabel={t("dialogs.import.close_aria")}
        >
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                accept="image/*"
                className="hidden"
            />
            <div className="flex-grow flex flex-col min-h-0 p-4 sm:p-6 bg-white dark:bg-zinc-800/50">
                {imageSrc ? (
                    <div className="flex flex-col flex-grow min-h-0">
                        <div
                            ref={cropContainerRef}
                            className="relative bg-gray-200 dark:bg-black rounded-md overflow-hidden cursor-grab active:cursor-grabbing"
                            style={{
                                aspectRatio: `${selectedFormat.widthPx} / ${selectedFormat.heightPx}`,
                            }}
                            onWheel={handleWheel}
                        >
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Import preview"
                                className={`absolute select-none max-w-none ${!isPanning ? "transition-transform duration-200 ease-out" : ""}`}
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                    ...getImageStyle(),
                                    transformOrigin: "top left",
                                    touchAction: "none",
                                }}
                                onLoad={handleImageLoad}
                                onMouseDown={handlePanStart}
                                onTouchStart={handlePanStart}
                                draggable="false"
                            />
                            {/* Guide overlay (from CameraView, with pointer-events-none for dragging) */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Face bounding oval */}
                                <div
                                    className="absolute border-2 border-white border-dashed rounded-full opacity-70"
                                    style={{
                                        width: `${guideOvalWidthPct}%`,
                                        height: `${guideOvalHeightPct}%`,
                                        left: "50%",
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                                {/* Head positioning inner oval */}
                                <div
                                    className="absolute border border-white border-dashed rounded-full opacity-50"
                                    style={{
                                        width: `${innerOvalWidthPct}%`,
                                        height: `${innerOvalHeightPct}%`,
                                        left: "50%",
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                                {/* Eye level guide */}
                                <div
                                    className="absolute left-[4%] right-[4%] h-0.5 bg-white opacity-40"
                                    style={{ top: `${eyeLineTopPct}%` }}
                                />
                                {/* Center line */}
                                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white opacity-30 transform -translate-x-0.5" />
                                {/* Corner guides for framing */}
                                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white opacity-60"></div>
                                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white opacity-60"></div>
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white opacity-60"></div>
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white opacity-60"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white text-xs bg-black/40 rounded px-2 py-1 text-center select-none">
                                        {t("dialogs.import.guide_align")}
                                        <br />
                                        {t("dialogs.import.guide_drag")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <ZoomOut
                                size={20}
                                className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                onClick={() =>
                                    handleZoomChange(Math.max(1, zoom - 0.1))
                                }
                            />
                            <Slider
                                min={1}
                                max={3}
                                step={0.05}
                                value={[zoom]}
                                onValueChange={(value) =>
                                    handleZoomChange(value[0])
                                }
                                className="w-full"
                            />
                            <ZoomIn
                                size={20}
                                className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                onClick={() =>
                                    handleZoomChange(Math.min(3, zoom + 0.1))
                                }
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 flex-shrink-0">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 shadow-lg"
                            >
                                <RotateCcw size={18} />
                                {t("dialogs.import.change_image_button")}
                            </button>
                            <button
                                type="button"
                                onClick={handleCrop}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 shadow-lg"
                            >
                                <Check size={18} />
                                {t("dialogs.import.confirm_crop_button")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center p-6 sm:p-10 border-2 border-dashed rounded-lg transition-colors ${isDragging ? "border-red-500 bg-red-50 dark:bg-zinc-800" : "border-gray-300 dark:border-zinc-700"}`}
                    >
                        <UploadCloud
                            className={`w-12 h-12 mb-3 transition-colors ${isDragging ? "text-red-600" : "text-gray-400"}`}
                        />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                                {t("dialogs.import.drag_drop_text")}
                            </span>{" "}
                            {t("dialogs.import.drag_drop_subtext")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("dialogs.import.or")}
                        </p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded text-center transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg"
                        >
                            {isMobile
                                ? t("dialogs.import.choose_from_phone_button")
                                : t(
                                      "dialogs.import.choose_from_computer_button",
                                  )}
                        </button>
                    </div>
                )}
            </div>
        </Dialog>
    );
}
