import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { Progress } from "@/components/ui/progress"
import { GlobalSpinner } from "@/widget/globalSpinner"
import { Logger, LoggerShowing } from "@/lib/LogUtil"

interface ProgressBarContextValue {
  progress: number
  isVisible: boolean
  showProgress: (initialValue?: number) => void
  setProgress: (value: number) => void
  increaseProgress: (amount?: number) => void
  hideProgress: () => void
  completeProgress: () => void
}

const ProgressBarContext =
  createContext<ProgressBarContextValue | undefined>(undefined)

interface ProgressBarProviderProps {
  children: ReactNode
}

export default function ProgressBarProvider({
  children,
}: ProgressBarProviderProps) {
  const [progress, setProgressState] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const setProgress = useCallback((value: number) => {
    const normalizedValue = Math.min(100, Math.max(0, value))
    LoggerShowing(`setProgress : ${value}`,true)
    setProgressState(normalizedValue)

  }, [])

  const showProgress = useCallback((initialValue = 0) => {
    setProgressState(initialValue)
    LoggerShowing(`setProgress : ${initialValue}`,true)
    setIsVisible(true)
  }, [])

  const increaseProgress = useCallback((amount = 10) => {
    setProgressState((current) =>
      Math.min(100, Math.max(0, current + amount)),
    )
  }, [])

  const hideProgress = useCallback(() => {
    setIsVisible(false)
    setProgressState(0)
  }, [])

  const completeProgress = useCallback(() => {
    setProgressState(100)

    window.setTimeout(() => {
      setIsVisible(false)
      setProgressState(0)
    }, 400)
  }, [])

  const value = useMemo(
    () => ({
      progress,
      isVisible,
      showProgress,
      setProgress,
      increaseProgress,
      hideProgress,
      completeProgress,
    }),
    [
      progress,
      isVisible,
      showProgress,
      setProgress,
      increaseProgress,
      hideProgress,
      completeProgress,
    ],
  )

  return (
    <ProgressBarContext.Provider value={value}>
      {children}

      {isVisible && (
        <div className="fixed left-0 top-0 z-[100] w-full">
          {/* <Progress
            value={progress}
            className="h-1 rounded-none bg-transparent"
          /> */}
          <GlobalSpinner progress="처리중" />
        </div>
      )}
    </ProgressBarContext.Provider>
  )
}

export function useProgressBar() {
  const context = useContext(ProgressBarContext)

  if (!context) {
    throw new Error(
      "useProgressBar는 ProgressBarProvider 내부에서 사용해야 합니다.",
    )
  }

  return context
}