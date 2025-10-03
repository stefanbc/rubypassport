import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-red-600",
    {
        variants: {
            variant: {
                default:
                    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
                destructive:
                    "bg-red-100/50 text-red-500/80 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-800 dark:text-red-300/80 dark:hover:bg-zinc-700 dark:hover:text-red-300",
                outline:
                    "border border-red-200 bg-transparent hover:bg-red-100/50 dark:border-red-900/40 dark:hover:bg-zinc-800/50",
                secondary:
                    "bg-gray-600 text-white hover:bg-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600",
                ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700",
                link: "text-red-600 underline-offset-4 hover:underline dark:text-red-400",
                icon: "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800",
            },
            size: {
                default: "h-10 px-4 py-3",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8 py-3",
                icon: "h-8 w-8 p-1.5",
                toolbar: "h-auto px-3 py-2",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
