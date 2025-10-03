import {
    Download,
    Image as ImageIcon,
    Loader2,
    Pencil,
    Printer,
    Trash2,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { FORMATS } from "@/types";

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
    const { t } = useTranslation();
    const {
        isProcessingImage,
        capturedImage,
        personName,
        setPersonName,
        isMobile,
        selectedFormatId,
        customFormats,
        captureQueue,
    } = useStore();

    const allFormats = [...FORMATS, ...customFormats];
    const selectedFormat =
        allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];
    const { widthPx, heightPx, label } = selectedFormat;
    const [isDetailsPopoverOpen, setIsDetailsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const detailsButtonRef = useRef<HTMLButtonElement>(null);
    const personNameId = useId();

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                isDetailsPopoverOpen &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                detailsButtonRef.current &&
                !detailsButtonRef.current.contains(event.target as Node)
            ) {
                setIsDetailsPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isDetailsPopoverOpen]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // Prevent the page from unloading immediately.
            event.preventDefault();
            // Note: Most modern browsers show a generic message and ignore this custom one for security reasons.
            event.returnValue = t(
                "components.panels.result.before_unload_prompt",
            );
        };

        if (capturedImage) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        // Cleanup the event listener when the component unmounts or the image is cleared.
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [capturedImage, t]);

    return (
        <div
            className={`bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 overflow-y-auto ${!isMobile && "shadow-xl hover:shadow-2xl"}`}
        >
            <div
                className={`flex justify-between items-center ${capturedImage && !isProcessingImage ? "mb-2" : "mb-4"}`}
            >
                <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none">
                    {t("components.panels.result.title")}
                </h2>
                <div className="relative flex items-center gap-2">
                    {capturedImage && !isProcessingImage && (
                        <>
                            <button
                                type="button"
                                ref={detailsButtonRef}
                                onClick={() =>
                                    setIsDetailsPopoverOpen(
                                        !isDetailsPopoverOpen,
                                    )
                                }
                                className={`flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors rounded-md ${isMobile ? "p-2.5" : "py-2 px-3"}`}
                                title={t(
                                    "components.panels.result.edit_details_tooltip",
                                )}
                            >
                                <Pencil size={isMobile ? 18 : 16} />
                                {!isMobile && (
                                    <span>
                                        {t(
                                            "components.panels.result.details_button",
                                        )}
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onRetake}
                                className={`flex items-center gap-1.5 text-sm text-red-500/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 transition-colors transition-transform duration-150 hover:-translate-y-0.5 rounded-md bg-red-100/50 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer ${isMobile ? "p-2.5" : "py-2 px-3"}`}
                            >
                                <Trash2 size={isMobile ? 18 : 16} />
                                {!isMobile && (
                                    <span>
                                        {t(
                                            "components.panels.result.retake_button",
                                        )}
                                    </span>
                                )}
                            </button>
                        </>
                    )}
                    {isDetailsPopoverOpen && (
                        <div
                            ref={popoverRef}
                            className="absolute top-full right-0 mt-2 z-10 w-72 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-700 p-4 space-y-4 animate-in fade-in-5 slide-in-from-top-2 duration-200"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor={personNameId}
                                    className="text-gray-800 dark:text-gray-100 text-sm font-medium select-none"
                                >
                                    {t(
                                        "components.panels.result.person_name_label",
                                    )}
                                </label>
                                <input
                                    id={personNameId}
                                    type="text"
                                    value={personName}
                                    onChange={(e) =>
                                        setPersonName(e.target.value)
                                    }
                                    placeholder={t(
                                        "components.panels.result.optional_placeholder",
                                    )}
                                    className="w-full bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm py-2 px-3 rounded border border-red-200 dark:border-red-900/40"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="relative bg-gray-200 dark:bg-black rounded overflow-hidden mb-4 ring-1 ring-red-200 dark:ring-red-900/40"
                style={{
                    aspectRatio: `${widthPx} / ${heightPx}`,
                    contain: "strict",
                }}
            >
                {/* Render image if we have one, regardless of processing state */}
                {capturedImage && (
                    <img
                        src={capturedImage}
                        alt={t("components.panels.result.captured_alt")}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                )}

                {/* Show loader if processing. It will overlay the image if it exists. */}
                {isProcessingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm transition-opacity duration-300">
                        <Loader2
                            size={32}
                            className="animate-spin mb-2 text-red-500"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t("components.panels.result.processing")}
                        </p>
                    </div>
                )}

                {/* Show placeholder only if there's no image and we're not processing */}
                {!capturedImage && !isProcessingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
                        <ImageIcon
                            size={42}
                            className="mx-auto mb-2 opacity-70"
                        />
                        <p className="select-none text-sm text-gray-500 dark:text-gray-400">
                            {t("components.panels.result.placeholder")}
                        </p>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded select-none">
                    {label} ({widthPx}x{heightPx}px)
                </div>
            </div>

            <div className="flex-grow" />

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    onClick={onDownload}
                    disabled={
                        (!capturedImage && captureQueue.length === 0) ||
                        isProcessingImage
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    <Download size={20} />
                    {t("components.panels.result.download_button")}
                </button>
                <button
                    type="button"
                    onClick={onOpenPrintDialog}
                    disabled={
                        (!capturedImage && captureQueue.length === 0) ||
                        isProcessingImage
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-3 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    <Printer size={20} />
                    {t("components.panels.result.print_button")}
                </button>
            </div>
        </div>
    );
}
