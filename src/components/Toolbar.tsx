import {
    Maximize,
    Minimize,
    Info,
    Keyboard,
    Images,
    SlidersHorizontal,
    Moon,
    Sun,
    Languages,
} from 'lucide-react';
import { useStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { useTheme } from '../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/DropdownMenu';

type ToolbarButtonProps = {
    onClick: () => void;
    title: string;
    'aria-pressed'?: boolean;
    className?: string;
    children: React.ReactNode;
    defaultStyle?: boolean;
};

const ToolbarButton = ({ title, children, ...props }: ToolbarButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <button
                {...props}
                className={`p-2 ${props.defaultStyle && 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800'} rounded-full transition-all duration-300 ease-in-out hover:scale-110 ${props.className}`}
            >
                {children}
            </button>
        </TooltipTrigger>
        <TooltipContent>
            <p>{title}</p>
        </TooltipContent>
    </Tooltip>
);

type HeaderProps = {
    onToggleFullscreen: () => void;
    onManageFormatsClick: () => void;
    selectedFormatLabel: string;
};

export function Toolbar({ onToggleFullscreen, onManageFormatsClick, selectedFormatLabel }: HeaderProps) {
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
        }))
    );
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();

    const hasQueue = captureQueue.length > 0;

    const handleMultiCaptureToggle = () => {
        if (hasQueue) {
            setActiveDialog('photoQueue');
        } else {
            const newState = !multiCaptureEnabled;
            setMultiCaptureEnabled(newState);
            addToast(
                newState
                    ? t('toasts.photoBoothEnabled')
                    : t('toasts.photoBoothDisabled'),
                'info',
                2500
            );
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className={`flex items-center gap-1 sm:gap-2 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 py-1 px-4 rounded-full ${!isMobile && 'shadow-xl hover:shadow-2xl'}`}>
                {isMobile ? (
                    <ToolbarButton onClick={onManageFormatsClick} title={t('tooltips.formatSettings')} defaultStyle>
                        <SlidersHorizontal size={20} />
                    </ToolbarButton>
                ) : (
                    <ToolbarButton
                        onClick={onManageFormatsClick}
                        title={t('tooltips.changeFormat')}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-zinc-800 px-3 py-1.5"
                        defaultStyle
                    >
                        <span className={isTablet ? 'truncate max-w-32 xl:max-w-48' : ''}>{selectedFormatLabel}</span>
                        <SlidersHorizontal size={20} />
                    </ToolbarButton>
                )}
                <ToolbarButton onClick={handleMultiCaptureToggle} title={hasQueue ? t('tooltips.viewPhotoQueue', { count: captureQueue.length }) : (multiCaptureEnabled ? t('tooltips.photoBoothEnabled') : t('tooltips.enablePhotoBooth'))} aria-pressed={multiCaptureEnabled || hasQueue} className={`relative ${(multiCaptureEnabled || hasQueue) ? 'bg-red-600 text-white hover:bg-red-700' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>
                    <Images size={20} />
                    {hasQueue && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-white text-[10px] font-bold ring-2 ring-gray-50 dark:ring-black">{captureQueue.length}</span>}
                </ToolbarButton>
                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all duration-300 ease-in-out hover:scale-110">
                                    <Languages size={20} />
                                </button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('tooltips.changeLanguage')}</p>
                        </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => i18n.changeLanguage('en')} disabled={i18n.language === 'en'}>{t('common.english')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => i18n.changeLanguage('ro')} disabled={i18n.language === 'ro'}>{t('common.romanian')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ToolbarButton onClick={() => setActiveDialog('info')} title={t('tooltips.showInfo')} defaultStyle><Info size={20} /></ToolbarButton>
                <ToolbarButton
                    onClick={toggleTheme}
                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                    aria-label="Toggle theme (T)"
                    title={theme === 'light' ? t('tooltips.switchToDark') : t('tooltips.switchToLight')}
                    defaultStyle
                >
                    {theme === 'light' ? (
                        <Moon className="h-6 w-6" />
                    ) : (
                        <Sun className="h-6 w-6" />
                    )}
                </ToolbarButton>
                {!isMobile && <ToolbarButton onClick={onToggleFullscreen} title={isFullscreen ? t('tooltips.exitFullscreen') : t('tooltips.enterFullscreen')} defaultStyle>{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</ToolbarButton>}
                {!isMobile && <ToolbarButton onClick={() => setActiveDialog('shortcuts')} title={t('tooltips.showShortcuts')} defaultStyle><Keyboard size={20} /></ToolbarButton>}
            </div>
        </TooltipProvider>
    );
}