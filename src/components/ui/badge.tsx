import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
        active: "border-transparent bg-accent text-accent-foreground",
        inactive: "border-transparent bg-muted text-muted-foreground",
        full_time: "border-transparent bg-secondary text-secondary-foreground",
        part_time: "border-transparent bg-accent/70 text-accent-foreground",
        intern: "border-transparent bg-muted text-foreground",
        "full-time": "border-transparent bg-secondary text-secondary-foreground",
        internship: "border-transparent bg-accent/70 text-accent-foreground",
        contract: "border-transparent bg-muted text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
