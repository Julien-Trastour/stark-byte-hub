type Props = {
    label: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  
  export function Checkbox({ label, checked, onChange }: Props) {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-blue-500 w-4 h-4"
        />
        <span>{label}</span>
      </label>
    )
  }
  