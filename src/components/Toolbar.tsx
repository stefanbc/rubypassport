import {
    Maximize,
    Minimize,
    Info,
    Keyboard,
    Images,
    SlidersHorizontal,
    Moon,
    Sun,
} from 'lucide-react';
import { useStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { useTheme } from '../contexts/ThemeProvider';

type ToolbarButtonProps = {
    onClick: () => void;
    title: string;
    'aria-pressed'?: boolean;
    className?: string;
    children: React.ReactNode;
};

const ToolbarButton = ({ title, children, ...props }: ToolbarButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <button
                {...props}
                className={`p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 ease-in-out hover:scale-110 ${props.className}`}
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
        setActiveDialog,
        multiCaptureEnabled,
        setMultiCaptureEnabled,
        addToast,
        captureQueue,
    } = useStore(
        useShallow((state) => ({
            isFullscreen: state.isFullscreen,
            isMobile: state.isMobile,
            setActiveDialog: state.setActiveDialog,
            multiCaptureEnabled: state.multiCaptureEnabled,
            setMultiCaptureEnabled: state.setMultiCaptureEnabled,
            addToast: state.addToast,
            captureQueue: state.captureQueue,
        }))
    );
    const { theme, toggleTheme } = useTheme();

    const hasQueue = captureQueue.length > 0;

    const handleMultiCaptureToggle = () => {
        if (hasQueue) {
            setActiveDialog('photoQueue');
        } else {
            const newState = !multiCaptureEnabled;
            setMultiCaptureEnabled(newState);
            addToast(
                newState
                    ? 'Photo Booth mode enabled - photos will be queued for batch printing'
                    : 'Photo Booth mode disabled - single photo mode',
                'info',
                2500
            );
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className={`flex items-center gap-1 sm:gap-2 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 py-1 px-4 rounded-full ${!isMobile && 'shadow-xl hover:shadow-2xl'}`}>
                {isMobile ? (
                    <ToolbarButton onClick={onManageFormatsClick} title="Format Settings (F)">
                        <SlidersHorizontal size={20} />
                    </ToolbarButton>
                ) : (
                    <ToolbarButton
                        onClick={onManageFormatsClick}
                        title="Change format or manage custom formats (F)"
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors px-3 py-1.5 rounded-full"
                    >
                        <span className="truncate max-w-32 xl:max-w-48">{selectedFormatLabel}</span>
                        <SlidersHorizontal size={16} />
                    </ToolbarButton>
                )}
                <ToolbarButton onClick={handleMultiCaptureToggle} title={hasQueue ? `View Photo Queue (${captureQueue.length})` : (multiCaptureEnabled ? 'Photo Booth enabled (B)' : 'Enable Photo Booth (B)')} aria-pressed={multiCaptureEnabled} className={`relative ${(multiCaptureEnabled || hasQueue) && 'bg-red-600 text-white hover:bg-red-700'}`}>
                    <Images size={20} />
                    {hasQueue && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-white text-[10px] font-bold ring-2 ring-gray-50 dark:ring-black">{captureQueue.length}</span>}
                </ToolbarButton>
                <ToolbarButton onClick={() => setActiveDialog('info')} title="Show info dialog (I)"><Info size={20} /></ToolbarButton>
                <ToolbarButton
                    onClick={toggleTheme}
                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                    aria-label="Toggle theme (T)"
                    title={theme === 'light' ? 'Switch to dark theme (T)' : 'Switch to light theme (T)'}
                >
                    {theme === 'light' ? (
                        <Moon className="h-6 w-6" />
                    ) : (
                        <Sun className="h-6 w-6" />
                    )}
                </ToolbarButton>
                {!isMobile && <ToolbarButton onClick={onToggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</ToolbarButton>}
                {!isMobile && <ToolbarButton onClick={() => setActiveDialog('shortcuts')} title="Show keyboard shortcuts (?)"><Keyboard size={20} /></ToolbarButton>}
            </div>
        </TooltipProvider>
    );
}