import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-gaming",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary hover:scale-105",
        hero: "bg-gradient-gaming text-primary-foreground hover:glow-primary hover:scale-110 font-bold text-lg border border-primary/30",
        primary: "bg-gradient-primary text-primary-foreground hover:glow-primary hover:scale-105 border border-primary/20",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:glow-secondary hover:scale-105 border border-secondary/20",
        accent: "bg-gradient-accent text-accent-foreground hover:glow-accent hover:scale-105 border border-accent/20",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:glow-primary backdrop-blur-sm",
        ghost: "hover:bg-muted/50 hover:text-foreground backdrop-blur-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:glow-accent",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
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