import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'neon';
};

export function Button({ variant = 'default', className = '', children, ...props }: Props) {
  const base = 'relative px-4 py-2 flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition-colors overflow-hidden';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-500',
    outline: 'border border-gray-400 text-white hover:bg-gray-700',
    neon: 'border border-[#00aaff] text-[#00aaff] hover:bg-[#00aaff] hover:text-[#121212]',
  };

  const blurOverlay =
    variant === 'neon' ? (
      <span className="absolute flex items-center justify-center inset-0 h-full w-full bg-[#00aaff]/10 blur-md" />
    ) : null;

  return (
    <button {...props} className={clsx(base, variants[variant], className)}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {blurOverlay}
    </button>
  );
}
