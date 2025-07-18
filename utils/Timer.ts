type TimerCallback = (elapsedMs: number) => void

export class Timer {
  private startTime: number | null = null
  private elapsedBeforePause = 0
  private intervalId: number | null = null
  private tickCallback: TimerCallback | null = null
  private intervalMs: number

  constructor(intervalMs: number = 1000) {
    this.intervalMs = intervalMs
  }

  start(callback?: TimerCallback) {
    if (this.intervalId !== null) return // Already running

    this.startTime = Date.now()
    this.tickCallback = callback || null

    this.intervalId = setInterval(() => {
      const elapsed = this.getElapsed()
      this.tickCallback?.(elapsed)
    }, this.intervalMs) as unknown as number // Coerce to number for browser/React Native
  }

  pause() {
    if (this.intervalId === null) return

    clearInterval(this.intervalId)
    this.intervalId = null

    if (this.startTime !== null) {
      this.elapsedBeforePause += Date.now() - this.startTime
      this.startTime = null
    }
  }

  reset() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    this.startTime = null
    this.elapsedBeforePause = 0
  }

  getElapsed(): number {
    if (this.startTime !== null) {
      return Date.now() - this.startTime + this.elapsedBeforePause
    }

    return this.elapsedBeforePause
  }

  isRunning(): boolean {
    return this.intervalId !== null
  }
}