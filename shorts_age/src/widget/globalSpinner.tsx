import { LoaderCircle } from "lucide-react"


interface GlobalSpinnerProps {
  progress?: string
}


export function GlobalSpinner({
  progress,
}: GlobalSpinnerProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div className="flex flex-col items-center gap-3 rounded-lg bg-background p-6 shadow-lg">
        <LoaderCircle className="size-8 animate-spin text-primary" />

        <span className="text-sm text-muted-foreground">
          {progress !== undefined
            ? `${progress}`
            : "처리 중..."}
        </span>
      </div>
    </div>
  )
}