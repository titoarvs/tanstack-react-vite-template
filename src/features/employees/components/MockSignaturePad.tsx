import { Eraser, PenLine } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MockSignaturePadProps {
  label?: string
  hint?: string
  value?: string
  onChange: (dataUrl: string | null) => void
  disabled?: boolean
  /** Re-measure when the pad becomes visible (e.g. modal open). */
  active?: boolean
  className?: string
}

/** CSS pixel coords — canvas context is already scaled for devicePixelRatio. */
function getPoint(
  canvas: HTMLCanvasElement,
  event: React.PointerEvent<HTMLCanvasElement>
) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

export function MockSignaturePad({
  label = "Draw your signature",
  hint = "Use your mouse or finger to sign in the box below.",
  value,
  onChange,
  disabled = false,
  active = true,
  className,
}: MockSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const dprRef = useRef(1)
  const [isEmpty, setIsEmpty] = useState(!value)

  const applyStrokeStyle = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = 2
    ctx.strokeStyle = "var(--foreground, #111)"
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    const ratio = window.devicePixelRatio || 1
    dprRef.current = ratio
    canvas.width = Math.floor(rect.width * ratio)
    canvas.height = Math.floor(rect.height * ratio)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(ratio, ratio)
    applyStrokeStyle(ctx)

    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height)
        setIsEmpty(false)
      }
      img.src = value
    }
  }, [applyStrokeStyle, value])

  useEffect(() => {
    if (!active) return
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!parent) {
      return () => window.removeEventListener("resize", resizeCanvas)
    }
    const observer = new ResizeObserver(() => resizeCanvas())
    observer.observe(parent)
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      observer.disconnect()
    }
  }, [active, resizeCanvas])

  useEffect(() => {
    if (!active || disabled) return
    const frame = requestAnimationFrame(() => {
      resizeCanvas()
      requestAnimationFrame(resizeCanvas)
    })
    return () => cancelAnimationFrame(frame)
  }, [active, disabled, resizeCanvas])

  const emitSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    onChange(canvas.toDataURL("image/png"))
    setIsEmpty(false)
  }

  const startDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    drawingRef.current = true
    canvas.setPointerCapture(event.pointerId)
    const { x, y } = getPoint(canvas, event)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || disabled) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const { x, y } = getPoint(canvas, event)
    ctx.lineTo(x, y)
    ctx.stroke()
    setIsEmpty(false)
  }

  const endDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    drawingRef.current = false
    const canvas = canvasRef.current
    canvas?.releasePointerCapture(event.pointerId)
    emitSignature()
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const ratio = dprRef.current
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(ratio, ratio)
    applyStrokeStyle(ctx)
    setIsEmpty(true)
    onChange(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <PenLine
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-dashed border-border bg-card",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <canvas
          ref={canvasRef}
          className="block h-36 w-full touch-none cursor-crosshair dark:bg-white"
          aria-label={label}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
        />
        {isEmpty && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/70">
            Sign here
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={disabled || isEmpty}
        >
          <Eraser className="h-4 w-4" />
          Clear signature
        </Button>
      </div>
    </div>
  )
}
