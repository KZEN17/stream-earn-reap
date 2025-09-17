import * as React from "react";
import { cn } from "@/lib/utils";

const ModernCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-lg bg-card text-card-foreground border border-border/20 gaming-card backdrop-blur-sm",
      "hover:border-primary/30 transition-all duration-300",
      className
    )} 
    {...props} 
  />
));
ModernCard.displayName = "ModernCard";

const ModernCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
ModernCardHeader.displayName = "ModernCardHeader";

const ModernCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight font-display", className)} {...props} />
  ),
);
ModernCardTitle.displayName = "ModernCardTitle";

const ModernCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground font-body", className)} {...props} />
  ),
);
ModernCardDescription.displayName = "ModernCardDescription";

const ModernCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
ModernCardContent.displayName = "ModernCardContent";

const ModernCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
ModernCardFooter.displayName = "ModernCardFooter";

export { ModernCard, ModernCardHeader, ModernCardFooter, ModernCardTitle, ModernCardDescription, ModernCardContent };