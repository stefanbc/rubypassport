import { Switch as SwitchPrimitives } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

const ToggleSwitch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600",
            "data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300",
            "dark:focus-visible:ring-red-500 dark:focus-visible:ring-offset-zinc-950",
            "dark:data-[state=checked]:bg-red-600 dark:data-[state=checked]:border-red-600",
            "dark:data-[state=unchecked]:bg-zinc-700 dark:data-[state=unchecked]:border-zinc-600",
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-zinc-950",
            )}
        />
    </SwitchPrimitives.Root>
));
ToggleSwitch.displayName = SwitchPrimitives.Root.displayName;

export { ToggleSwitch };
