import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: Props) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-md border border-[#444] bg-[#1e1e1e] px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-[#00aaff] focus:ring-1 focus:ring-[#00aaff]',
        className
      )}
    />
  );
}
