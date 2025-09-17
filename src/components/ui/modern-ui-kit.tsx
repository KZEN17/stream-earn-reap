import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Modern Badge Component
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground glow-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground glow-secondary",
        accent: "border-transparent bg-accent text-accent-foreground glow-accent",
        destructive: "border-transparent bg-destructive text-destructive-foreground glow-accent",
        outline: "border-primary text-primary hover:glow-primary",
        glass: "bg-glass-bg backdrop-blur-sm border-glass-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Modern Toggle Component
const toggleVariants = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        secondary: "data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input",
        accent: "data-[state=checked]:bg-accent data-[state=unchecked]:bg-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToggleProps extends VariantProps<typeof toggleVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Toggle({ variant, checked, onCheckedChange, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(toggleVariants({ variant }), className)}
      onClick={() => onCheckedChange?.(!checked)}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// Modern Tooltip Component
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-xs font-medium text-foreground bg-glass-bg backdrop-blur-sm border border-glass-border rounded-lg shadow-lg",
            {
              "bottom-full left-1/2 transform -translate-x-1/2 mb-2": side === "top",
              "top-1/2 left-full transform -translate-y-1/2 ml-2": side === "right",
              "top-full left-1/2 transform -translate-x-1/2 mt-2": side === "bottom",
              "top-1/2 right-full transform -translate-y-1/2 mr-2": side === "left",
            }
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Status Indicator Component
const statusVariants = cva(
  "inline-flex h-2 w-2 rounded-full",
  {
    variants: {
      status: {
        online: "bg-secondary glow-secondary animate-pulse",
        offline: "bg-muted-foreground",
        away: "bg-warning",
        busy: "bg-destructive glow-accent",
      },
    },
    defaultVariants: {
      status: "offline",
    },
  }
);

export interface StatusIndicatorProps extends VariantProps<typeof statusVariants> {
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return <div className={cn(statusVariants({ status }), className)} />;
}

// Progress Bar Component
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: "default" | "secondary" | "accent";
}

export function Progress({ value, max = 100, className, variant = "default" }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantClasses = {
    default: "bg-primary glow-primary",
    secondary: "bg-secondary glow-secondary", 
    accent: "bg-accent glow-accent",
  };

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full transition-all duration-500 ease-out", variantClasses[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}