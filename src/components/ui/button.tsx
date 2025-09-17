import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-pink text-white hover:bg-pink/80 shadow-[0_0_20px_rgba(255,27,141,0.4)] hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan",
        hero: "bg-gradient-pink-purple text-white hover:opacity-90 shadow-[0_0_30px_rgba(255,27,141,0.6)] hover:scale-105 font-bold text-lg border border-pink/30 focus-visible:ring-2 focus-visible:ring-cyan",
        primary: "bg-pink text-white hover:bg-pink/80 shadow-[0_0_20px_rgba(255,27,141,0.4)] hover:scale-105 border border-pink/20 focus-visible:ring-2 focus-visible:ring-cyan",
        secondary: "border-2 border-purple bg-transparent text-purple hover:bg-purple/10 focus-visible:ring-2 focus-visible:ring-cyan",
        success: "bg-green text-bg hover:bg-green/80 shadow-[0_0_20px_rgba(60,255,136,0.4)] hover:scale-105 border border-green/20 focus-visible:ring-2 focus-visible:ring-cyan",
        warning: "bg-yellow text-bg hover:bg-yellow/80 shadow-[0_0_20px_rgba(229,255,0,0.4)] hover:scale-105 border border-yellow/20 focus-visible:ring-2 focus-visible:ring-cyan",
        info: "bg-cyan text-white hover:bg-cyan/80 shadow-[0_0_20px_rgba(0,207,255,0.4)] hover:scale-105 border border-cyan/20 focus-visible:ring-2 focus-visible:ring-cyan",
        outline: "border-2 border-pink bg-transparent text-pink hover:bg-pink/10 shadow-[0_0_15px_rgba(255,27,141,0.3)] backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-cyan",
        ghost: "hover:bg-line/50 hover:text-text backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-cyan",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_rgba(248,113,113,0.4)] focus-visible:ring-2 focus-visible:ring-cyan",
        link: "text-pink underline-offset-4 hover:underline hover:text-pink/80 focus-visible:ring-2 focus-visible:ring-cyan",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-xl px-8",
        icon: "h-12 w-12",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };