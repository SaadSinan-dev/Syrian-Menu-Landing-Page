import { useEffect } from 'react'

/** One observer, one reveal per element. Content is visible if motion/observers are unavailable. */
export function useReveals(route: boolean) {
  useEffect(() => {
    if (
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    )
      return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px 35px 0px', threshold: 0.06 },
    )
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      const rect = element.getBoundingClientRect()
      if (rect.top < innerHeight && rect.bottom > 0) element.classList.add('is-revealed')
      else {
        element.classList.add('will-reveal')
        observer.observe(element)
      }
    })
    return () => observer.disconnect()
  }, [route])
}
