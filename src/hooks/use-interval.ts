import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, delay: number): void => {
  const savedCallback = useRef<typeof callback>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = (): void => {
      savedCallback?.current?.()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => { clearInterval(id) }
    }
  }, [delay])
}
