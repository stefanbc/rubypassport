import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "flex-shrink-0 flex items-center gap-2 p-2 border-b border-gray-200 dark:border-zinc-800",
            className,
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=active]:bg-red-100 data-[state=active]:text-red-700 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-red-300",
            "data-[state=inactive]:text-gray-500 data-[state=inactive]:dark:text-gray-400 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:dark:hover:bg-zinc-800",
            className,
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = TabsPrimitive.Content;

export { Tabs, TabsList, TabsTrigger, TabsContent };
