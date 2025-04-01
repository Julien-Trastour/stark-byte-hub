type Props = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({ label, checked, onChange, disabled = false, className = '' }: Props) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer text-sm text-gray-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-5 h-5 appearance-none rounded-md border border-gray-500 bg-[#1e1e1e] checked:bg-[#00aaff] checked:border-[#00aaff] focus:ring-2 focus:ring-[#00aaff] transition"
      />
      <span>{label}</span>
    </label>
  );
}
