type Props = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({ label, checked, onChange, disabled = false, className = "" }: Props) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer text-sm text-gray-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer w-5 h-5 appearance-none rounded-sm border border-[#00aaff] bg-transparent checked:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#00aaff] transition"
        />
        <svg
          className="pointer-events-none absolute left-0 top-0 w-5 h-5 text-[#00aaff] opacity-0 peer-checked:opacity-100 transition-opacity"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="false"
          role="img"
        >
          <title>Coche activée</title>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span>{label}</span>
    </label>
  );
}
