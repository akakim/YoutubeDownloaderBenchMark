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
  progress: string
  isVisible: boolean
  showProgress: (initialValue?: string) => void
  setProgress: (value: string) => void
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
  const INIT_PROGRESS_LABEL = "처리 중"
  const [progress, setProgressState] = useState(INIT_PROGRESS_LABEL)
  const [isVisible, setIsVisible] = useState(false)

  const setProgress = useCallback((value: string) => {
    LoggerShowing(`setProgress : ${value}`,true)
    setProgressState(value)

  }, [])

  const showProgress = useCallback((initialValue = "") => {
    setProgressState(initialValue)
    LoggerShowing(`setProgress : ${initialValue}`,true)
    setIsVisible(true)
  }, [])


  const hideProgress = useCallback(() => {
    setIsVisible(false)
    setProgressState("")
  }, [])

  const completeProgress = useCallback(() => {
    setProgressState(INIT_PROGRESS_LABEL)

    window.setTimeout(() => {
      setIsVisible(false)
      setProgressState(INIT_PROGRESS_LABEL)
    }, 400)
  }, [])

  const value = useMemo(
    () => ({
      progress,
      isVisible,
      showProgress,
      setProgress,
      hideProgress,
      completeProgress,
    }),
    [
      progress,
      isVisible,
      showProgress,
      setProgress,
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
          <GlobalSpinner progress={progress} />
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