import {
    Images,
    Info,
    Keyboard,
    Languages,
    Maximize,
    Menu,
    Minimize,
    Moon,
    SlidersHorizontal,
    Sun,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui";
import { useTheme } from "@/contexts/ThemeProvider";
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
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const languages = [
        {
            label: t("common.german"),
            value: "de",
        },
        {
            label: t("common.english"),
            value: "en",
        },
        {
            label: t("common.romanian"),
            value: "ro",
        },
        {
            label: t("common.spanish"),
            value: "es",
        },
    ];

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
                            onClick={toggleTheme}
                            title={
                                theme === "light"
                                    ? t("tooltips.switchToDark")
                                    : t("tooltips.switchToLight")
                            }
                            defaultStyle
                        >
                            {theme === "light" ? (
                                <Moon size={20} />
                            ) : (
                                <Sun size={20} />
                            )}
                        </ToolbarButton>
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <ToolbarButton
                                            title={t("tooltips.changeLanguage")}
                                            defaultStyle
                                        >
                                            <Languages size={20} />
                                        </ToolbarButton>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t("tooltips.changeLanguage")}</p>
                                </TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end">
                                {languages.map((language) => (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            i18n.changeLanguage(language.value)
                                        }
                                        disabled={
                                            i18n.language === language.value
                                        }
                                        key={language.value}
                                    >
                                        {language.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <ToolbarButton
                                title={t("tooltips.moreOptions")}
                                defaultStyle
                            >
                                <Menu size={20} />
                            </ToolbarButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={toggleTheme}
                                className="text-base py-2 px-3"
                            >
                                {theme === "light" ? (
                                    <Moon size={18} className="mr-3" />
                                ) : (
                                    <Sun size={18} className="mr-3" />
                                )}
                                <span>
                                    {theme === "light"
                                        ? t("tooltips.switchToDark")
                                        : t("tooltips.switchToLight")}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="text-base py-2 px-3">
                                    <Languages size={18} className="mr-3" />
                                    <span>{t("tooltips.changeLanguage")}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    {languages.map((language) => (
                                        <DropdownMenuItem
                                            key={language.value}
                                            onClick={() =>
                                                i18n.changeLanguage(
                                                    language.value,
                                                )
                                            }
                                            disabled={
                                                i18n.language === language.value
                                            }
                                            className="text-base py-2 px-3"
                                        >
                                            {language.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                                onClick={() => setActiveDialog("info")}
                                className="text-base py-2 px-3"
                            >
                                <Info size={18} className="mr-3" />
                                {t("tooltips.showInfo")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </TooltipProvider>
    );
}
