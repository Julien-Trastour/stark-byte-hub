import { useRef, useState, useEffect } from 'react'

type Props = {
  onMove: (x: number, y: number) => void
  size?: number
}

export default function Joystick({ onMove, size = 120 }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const stickRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !stickRef.current) return

      const rect = stickRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const radius = size / 2

      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), radius)
      const angle = Math.atan2(dy, dx)

      const newX = Math.cos(angle) * distance
      const newY = Math.sin(angle) * distance

      setPosition({ x: newX, y: newY })
      onMove(newX / radius, newY / radius)
    }

    const stopDrag = () => {
      setIsDragging(false)
      setPosition({ x: 0, y: 0 })
      onMove(0, 0)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopDrag)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopDrag)
    }
  }, [isDragging, onMove, size])

  return (
    <div
      ref={stickRef}
      style={{ width: size, height: size }}
      className="relative rounded-full border-2 border-[#00aaff] flex items-center justify-center"
      onMouseDown={() => setIsDragging(true)}
    >
      <div
        className="absolute rounded-full bg-[#00aaff] opacity-90 pointer-events-none transition-transform duration-75"
        style={{
          width: size / 2,
          height: size / 2,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    </div>
  )
}
