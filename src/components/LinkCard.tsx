import { useRef, type MouseEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Props = {
  title: string
  url: string
  index: number
}

export function LinkCard({ title, url, index }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / rect.height) * -6
    const rotateY = ((x - rect.width / 2) / rect.width) * 6
    el.style.setProperty('--rx', `${rotateX}deg`)
    el.style.setProperty('--ry', `${rotateY}deg`)
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <a
      ref={ref}
      className="link-card"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-link
    >
      <span className="link-card-shine" />
      <span className="link-card-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="link-card-title">{title}</span>
      <span className="link-card-arrow" aria-hidden>
        <ArrowUpRight size={18} strokeWidth={2.25} />
      </span>
    </a>
  )
}
