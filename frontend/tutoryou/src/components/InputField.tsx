import React from 'react'

// Defines the props
interface InputFieldProps {
  label: string // Text label for input field
  type: string // Type of input
  value: string // Current value for the input field
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

// Functional component for the input field
const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  </div>
)

export default InputField
