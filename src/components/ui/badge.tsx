import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-pink text-white hover:bg-pink/80 shadow-[0_0_10px_rgba(255,27,141,0.3)]",
        secondary: "border-transparent bg-purple text-white hover:bg-purple/80 shadow-[0_0_10px_rgba(139,95,255,0.3)]",
        success: "border-transparent bg-green text-bg hover:bg-green/80 shadow-[0_0_10px_rgba(60,255,136,0.3)]",
        warning: "border-transparent bg-yellow text-bg hover:bg-yellow/80 shadow-[0_0_10px_rgba(229,255,0,0.3)]",
        info: "border-transparent bg-cyan text-white hover:bg-cyan/80 shadow-[0_0_10px_rgba(0,207,255,0.3)]",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-line hover:bg-surface/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
