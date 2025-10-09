import { ChevronDown } from "lucide-react";
import { useState } from "react";

type AccordionProps = {
    title: string;
    children: React.ReactNode;
    isInitiallyCollapsed: boolean;
    titlePrefix?: React.ReactNode;
    titleClassName?: string;
    className?: string;
};

export function Accordion({
    title,
    children,
    isInitiallyCollapsed,
    titlePrefix,
    titleClassName = "text-lg font-semibold text-gray-700 dark:text-gray-200",
    className = "border-t border-gray-200 dark:border-zinc-700/50 pt-2",
}: AccordionProps) {
    const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);

    return (
        <div className={className}>
            <button
                type="button"
                className="w-full flex items-center justify-between text-left py-2"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-expanded={!isCollapsed}
            >
                <div className="flex items-center gap-2">
                    {titlePrefix}
                    <h3 className={titleClassName}>{title}</h3>
                </div>
                <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-300 ${
                        isCollapsed ? "" : "rotate-180"
                    }`}
                />
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${
                    isCollapsed
                        ? "grid-rows-[0fr] opacity-0"
                        : "grid-rows-[1fr] opacity-100"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="pt-2">{children}</div>
                </div>
            </div>
        </div>
    );
}
