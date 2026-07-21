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
    showProgress(0)

    timerIds.current = [
      window.setTimeout(() => setProgress(33), 1_000),
      window.setTimeout(() => setProgress(66), 2_000),
      window.setTimeout(() => setProgress(100), 3_000),
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
