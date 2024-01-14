import { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import { useField } from 'remix-validated-form'

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  name: string
  label?: string
}

export default function Input({ label, name, className, ...rest }: InputProps) {
  const { error } = useField(name)

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...rest}
        className="w-full rounded border-2 border-gray-400 px-2 py-1 text-lg"
        id={name}
        name={name}
      />
      {error && <span className="text-red-700 text-sm">{error}</span>}
    </div>
  )
}
