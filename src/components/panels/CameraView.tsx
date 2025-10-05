import {
    ArrowLeft,
    Camera,
    CameraOff,
    CheckCircle,
    Computer,
    Loader2,
    RefreshCw,
} from "lucide-react";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { FORMATS } from "@/types";

type CameraViewProps = {
    videoRef: RefObject<HTMLVideoElement | null>;
    onStartCamera: () => void;
    onStopCamera: () => void;
    onCapturePhoto: () => void;
    onImportClick: () => void;
    onSwitchCamera: () => void;
    onBack?: () => void;
};

export function CameraView({
    videoRef,
    onStartCamera,
    onStopCamera,
    onCapturePhoto,
    onImportClick,
    onSwitchCamera,
    onBack,
}: CameraViewProps) {
    const { t } = useTranslation();
    const {
        isCameraOn,
        isCameraLoading,
        selectedFormatId,
        customFormats,
        facingMode,
        isMobile,
        isTablet,
        showAlignGuides,
    } = useStore();
    const allFormats = [...FORMATS, ...customFormats];
    const selectedFormat =
        allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];

    // Human-proportional guide sizing (kept stable across formats)
    const guideOvalWidthPct = 42; // Approximate face width relative to frame width
    const guideOvalHeightPct = 64; // Approximate face height relative to frame height
    const innerOvalWidthPct = Math.round(guideOvalWidthPct * 0.72); // Head oval narrower than face boundary
    const innerOvalHeightPct = Math.round(guideOvalHeightPct * 0.8); // Head oval shorter than face boundary
    const eyeLineTopPct = 45; // Eye line ~45% from top

    return (
        <div
            className={`bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 relative overflow-y-auto ${!isMobile && "shadow-xl hover:shadow-2xl"}`}
        >
            <div
                className={`relative flex justify-between items-center ${isCameraOn ? "mb-2" : "mb-4"}`}
            >
                {isMobile && onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label={t("components.panels.camera.back_aria")}
                    >
                        <ArrowLeft size={24} />
                        <span className="hidden sm:inline">
                            {t("components.panels.camera.back")}
                        </span>
                    </button>
                )}
                <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none">
                    {t("components.panels.camera.preview")}
                </h2>
                <div className="relative flex items-center gap-2">
                    {isCameraOn && (isMobile || isTablet) && (
                        <button
                            type="button"
                            onClick={onSwitchCamera}
                            className={`flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors rounded-md ${isMobile ? "p-2.5" : "py-2 px-3"}`}
                            title={t(
                                "components.panels.camera.switch_camera_tooltip",
                            )}
                        >
                            <RefreshCw size={isMobile ? 18 : 16} />
                            {!isMobile && (
                                <span>
                                    {t(
                                        "components.panels.camera.switch_camera_button",
                                    )}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div
                className="relative bg-gray-200 dark:bg-black rounded overflow-hidden mb-4 ring-1 ring-red-200 dark:ring-red-900/40"
                style={{
                    aspectRatio: `${selectedFormat.widthPx} / ${selectedFormat.heightPx}`,
                }}
            >
                {isCameraOn ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`absolute inset-0 w-full h-full object-cover ${facingMode === "user" ? "transform -scale-x-100" : ""}`}
                        />
                        {showAlignGuides && (
                            <>
                                {/* Guide overlay (responsive to selected format) */}
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
                                </div>
                                {/* Corner guides for framing */}
                                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white opacity-60"></div>
                                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white opacity-60"></div>
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white opacity-60"></div>
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white opacity-60"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white text-xs bg-black/40 rounded px-2 py-1 text-center select-none">
                                        <span>
                                            {t(
                                                "components.panels.camera.guide_align_face",
                                            )}
                                        </span>
                                        <br />
                                        <span>
                                            {t(
                                                "components.panels.camera.guide_eyes_on_line",
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <div className="flex flex-col items-center">
                            {isCameraLoading ? (
                                <>
                                    <Loader2
                                        size={32}
                                        className="animate-spin mb-2 text-red-500"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t(
                                            "components.panels.camera.starting_camera",
                                        )}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CameraOff
                                        size={42}
                                        className="mx-auto mb-2 opacity-70"
                                    />
                                    <p className="select-none text-sm text-gray-500 dark:text-gray-400">
                                        {t(
                                            "components.panels.camera.camera_not_started",
                                        )}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-grow" />

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {!isCameraOn ? (
                        <>
                            <button
                                type="button"
                                onClick={onStartCamera}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                disabled={isCameraLoading}
                            >
                                {isCameraLoading ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Camera size={20} />
                                )}
                                {isCameraLoading
                                    ? t(
                                          "components.panels.camera.starting_button",
                                      )
                                    : t(
                                          "components.panels.camera.start_camera_button",
                                      )}
                            </button>
                            <button
                                type="button"
                                onClick={onImportClick}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-3 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                                disabled={isCameraLoading}
                            >
                                <Computer size={20} />
                                {t(
                                    "components.panels.camera.import_image_button",
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onCapturePhoto}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                            >
                                <CheckCircle size={20} />
                                {t(
                                    "components.panels.camera.capture_photo_button",
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onStopCamera}
                                className="px-4 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                            >
                                {t("components.panels.camera.stop_button")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
