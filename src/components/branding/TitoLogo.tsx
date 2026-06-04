import { cn } from "@/lib/utils"

interface TitoLogoProps {
  className?: string
  showWordmark?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "onDark"
}

const sizeMap = {
  sm: { mark: "h-7 w-7 text-xs", word: "text-lg" },
  md: { mark: "h-8 w-8 text-sm", word: "text-xl" },
  lg: { mark: "h-10 w-10 text-base", word: "text-2xl" },
} as const

export function TitoLogo({
  className,
  showWordmark = true,
  size = "md",
  variant = "default",
}: TitoLogoProps) {
  const sizes = sizeMap[size]
  const onDark = variant === "onDark"

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-tito-green to-tito-dull-blue font-bold text-logo-mark-fg shadow-sm",
          sizes.mark
        )}
      >
        T
      </div>
      {showWordmark && (
        <span className={cn("font-bold tracking-tight", sizes.word)}>
          <span className={onDark ? "text-brand-surface-fg" : "text-foreground"}>Tito</span>
          <span className="text-chart-1">HRIS</span>
        </span>
      )}
    </div>
  )
}
