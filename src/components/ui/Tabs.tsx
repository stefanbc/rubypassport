import type { ElementType, ReactNode } from "react";

type TabsProps = {
    children: ReactNode;
    ariaLabel: string;
};

export function Tabs({ children, ariaLabel }: TabsProps) {
    return (
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-zinc-800">
            <div
                className="flex items-center gap-2 p-2"
                role="tablist"
                aria-label={ariaLabel}
            >
                {children}
            </div>
        </div>
    );
}

type TabProps = {
    icon: ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
};

export function Tab({
    icon: Icon,
    label,
    isActive,
    onClick,
    disabled,
}: TabProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? "bg-red-100 dark:bg-zinc-700 text-red-700 dark:text-red-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
        >
            <Icon size={16} />
            <span>{label}</span>
        </button>
    );
}
