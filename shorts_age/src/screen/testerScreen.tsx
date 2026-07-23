import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { useProgressBar } from "@/widget/progressBarProvider"

export default function TesterScreen() {

  const { showProgress, setProgress, completeProgress , hideProgress } = useProgressBar()
  const timerIds = useRef<number[]>([])

  const clearTimers = () => {
    timerIds.current.forEach(window.clearTimeout)
    timerIds.current = []
  }

  const testProgress = () => {
    clearTimers()
    showProgress("처리중")

    timerIds.current = [
      window.setTimeout(() => setProgress("Mp4 업로드중"), 1_000),
      window.setTimeout(() => setProgress("Mp4 에서 Mp3로 변환중"), 2_000),
      window.setTimeout(() => setProgress("AI가 음성인식중"), 3_000),
        window.setTimeout(() => hideProgress(), 3_500),
    ]
  }

  useEffect(() => clearTimers, [])

  return (
    <>
      <h1>TesterScreen</h1>

      <Button onClick={testProgress}>Progress 테스트</Button>
    </>
  )
}
