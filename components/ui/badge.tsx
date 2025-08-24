import * as React from "react";

// Simple classnames combiner (replace with your own `cn` if you have one)
function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/**
 * Badge – a tiny status/pill label.
 * Tailwind required.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium select-none";
    const sizes: Record<BadgeSize, string> = {
      sm: "text-xs",
      md: "text-sm",
    };
    const variants: Record<BadgeVariant, string> = {
      default: "border-transparent bg-gray-900 text-white",
      secondary: "border-transparent bg-gray-100 text-gray-900",
      destructive: "border-transparent bg-red-100 text-red-700",
      outline: "border-gray-300 text-gray-800",
    };

    return (
      <span
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
