import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onClose: () => void
}

export function Dialog({ children}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

