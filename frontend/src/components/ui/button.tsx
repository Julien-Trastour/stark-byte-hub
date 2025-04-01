import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "default" | "outline" | "neon" | "destructive" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-[#00aaff] text-black hover:bg-[#00aaff]/90",
    outline: "border border-[#00aaff] text-[#00aaff] hover:bg-[#00aaff]/10",
    neon: "bg-[#00aaff]/10 text-[#00aaff] hover:bg-[#00aaff] hover:text-black",
    destructive: "bg-red-600 text-white hover:bg-red-500",
    ghost: "bg-transparent hover:bg-white/10 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      className={clsx(base, variants[variant], sizes[size], className)}
    />
  );
}
