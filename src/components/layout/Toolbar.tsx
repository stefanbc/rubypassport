import {
    Images,
    Info,
    Keyboard,
    Maximize,
    Minimize,
    Settings,
    SlidersHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui";
import { useStore } from "@/store";

type ToolbarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title: string;
    children: React.ReactNode;
    defaultStyle?: boolean;
};

const ToolbarButton = ({
    title,
    children,
    defaultStyle,
    ...props
}: ToolbarButtonProps) => {
    const buttonProps = { ...props, "aria-label": title };
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    {...buttonProps}
                    className={`${defaultStyle ? "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800" : ""} p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-110 ${props.className ?? ""}`}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
};

type HeaderProps = {
    onToggleFullscreen: () => void;
    onManageFormatsClick: () => void;
    selectedFormatLabel: string;
};

export function Toolbar({
    onToggleFullscreen,
    onManageFormatsClick,
    selectedFormatLabel,
}: HeaderProps) {
    const {
        isFullscreen,
        isMobile,
        isTablet,
        setActiveDialog,
        multiCaptureEnabled,
        setMultiCaptureEnabled,
        addToast,
        captureQueue,
    } = useStore(
        useShallow((state) => ({
            isFullscreen: state.isFullscreen,
            isMobile: state.isMobile,
            isTablet: state.isTablet,
            setActiveDialog: state.setActiveDialog,
            multiCaptureEnabled: state.multiCaptureEnabled,
            setMultiCaptureEnabled: state.setMultiCaptureEnabled,
            addToast: state.addToast,
            captureQueue: state.captureQueue,
        })),
    );
    const { t } = useTranslation();

    const hasQueue = captureQueue.length > 0;

    const handleMultiCaptureToggle = () => {
        if (hasQueue) {
            setActiveDialog("photoQueue");
        } else {
            const newState = !multiCaptureEnabled;
            setMultiCaptureEnabled(newState);
            addToast(
                newState
                    ? t("toasts.photoBoothEnabled")
                    : t("toasts.photoBoothDisabled"),
                "info",
                2500,
            );
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div
                className={`flex items-center justify-end bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 py-1 px-2 sm:px-4 rounded-full ${!isMobile ? "shadow-xl hover:shadow-2xl" : ""}`}
            >
                {/* Desktop Toolbar */}
                <ToolbarButton
                    onClick={onManageFormatsClick}
                    title={t("tooltips.changeFormat")}
                    className={`flex gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-zinc-800 ${isMobile ? "p-2" : "px-3 py-1.5"}`}
                    defaultStyle
                >
                    {!isMobile && (
                        <span
                            className={
                                isTablet ? "truncate max-w-32 xl:max-w-48" : ""
                            }
                        >
                            {selectedFormatLabel}
                        </span>
                    )}
                    <SlidersHorizontal size={20} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={handleMultiCaptureToggle}
                    title={
                        hasQueue
                            ? t("tooltips.viewPhotoQueue", {
                                  count: captureQueue.length,
                              })
                            : multiCaptureEnabled
                              ? t("tooltips.photoBoothEnabled")
                              : t("tooltips.enablePhotoBooth")
                    }
                    aria-pressed={multiCaptureEnabled || hasQueue}
                    className={`relative ${multiCaptureEnabled || hasQueue ? "bg-red-600 text-white hover:bg-red-700" : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"}`}
                    defaultStyle
                >
                    <Images size={20} />
                    {hasQueue && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-white text-[10px] font-bold ring-2 ring-gray-50 dark:ring-black">
                            {captureQueue.length}
                        </span>
                    )}
                </ToolbarButton>

                {!isMobile && (
                    <>
                        <ToolbarButton
                            onClick={() => setActiveDialog("info")}
                            title={t("tooltips.showInfo")}
                            defaultStyle
                        >
                            <Info size={20} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => setActiveDialog("settings")}
                            title={t("tooltips.showSettings")}
                            defaultStyle
                        >
                            <Settings size={20} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={onToggleFullscreen}
                            title={
                                isFullscreen
                                    ? t("tooltips.exitFullscreen")
                                    : t("tooltips.enterFullscreen")
                            }
                            defaultStyle
                        >
                            {isFullscreen ? (
                                <Minimize size={20} />
                            ) : (
                                <Maximize size={20} />
                            )}
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => setActiveDialog("shortcuts")}
                            title={t("tooltips.showShortcuts")}
                            defaultStyle
                        >
                            <Keyboard size={20} />
                        </ToolbarButton>
                    </>
                )}
                {isMobile && (
                    <>
                        <ToolbarButton
                            onClick={() => setActiveDialog("info")}
                            title={t("tooltips.showInfo")}
                            defaultStyle
                        >
                            <Info size={20} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => setActiveDialog("settings")}
                            title={t("tooltips.showSettings")}
                            defaultStyle
                        >
                            <Settings size={20} />
                        </ToolbarButton>
                    </>
                )}
            </div>
        </TooltipProvider>
    );
}
