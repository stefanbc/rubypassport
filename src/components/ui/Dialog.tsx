import { XCircle } from "lucide-react";
import type { ElementType, ReactNode } from "react";

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: ElementType;
    children: ReactNode;
    maxWidth?: string;
    closeAriaLabel?: string;
};

export function Dialog({
    isOpen,
    onClose,
    title,
    icon: Icon,
    children,
    maxWidth = "max-w-lg",
    closeAriaLabel = "Close dialog",
}: DialogProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div
                className={`bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full ${maxWidth} max-h-[80vh] flex flex-col overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
                    <h2
                        id="dialog-title"
                        className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3"
                    >
                        {Icon && <Icon size={24} />}
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full"
                        aria-label={closeAriaLabel}
                    >
                        <XCircle size={22} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
