import type { LabelHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = '', ...props }: Props) {
  return (
    <label
      {...props}
      className={clsx('block text-sm font-medium text-gray-300 mb-1', className)}
    />
  );
}
