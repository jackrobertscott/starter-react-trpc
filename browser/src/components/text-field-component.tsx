import { Mail, Lock, LucideIcon } from "lucide-react"
import {RefObject} from "react"
import {Icon} from "./icon-component"

type TextFieldProps = {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  type?: string
  inputRef?: RefObject<HTMLInputElement | null>
  icon?: LucideIcon
}

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputRef,
  icon,
}: TextFieldProps) {
  // Set default icon based on field type if not provided
  const defaultIcon = type === "password" ? Lock : Mail
  const fieldIcon = icon || defaultIcon

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <label
        htmlFor={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon icon={fieldIcon} size={20} color="#9ca3af" />
        </div>
        <input
          ref={inputRef}
          id={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
          type={type}
          value={value}
          onChange={handleChange}
          required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                    text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 focus:border-indigo-500 
                    transition duration-150 ease-in-out text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
