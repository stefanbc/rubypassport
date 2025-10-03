import { Label as RadixLabel } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
    React.ElementRef<typeof RadixLabel.Root>,
    React.ComponentPropsWithoutRef<typeof RadixLabel.Root>
>(({ className, ...props }, ref) => (
    <RadixLabel.Root
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            "text-gray-700 dark:text-gray-300 select-none",
            className,
        )}
        {...props}
    />
));
Label.displayName = RadixLabel.Root.displayName;

export { Label };
