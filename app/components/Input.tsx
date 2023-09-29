import { useField } from "remix-validated-form";
import clsx from "clsx";
import {HTMLInputTypeAttribute} from "react";

interface MyInputProps {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
}

export default function Input({ name, label, type, className }: MyInputProps) {
  const { error, getInputProps } = useField(name);
  return (
    <div className="relative pb-6">
      <label
        className="block text-sm font-medium text-gray-700"
        htmlFor={name}>
        {label}
      </label>
      <input
        className={clsx("rounded border border-gray-500 px-2 py-1 text-lg", className)}
        {...getInputProps({ id: name })}
        type={type}
      />
      {error && (
        <span className="absolute bottom-0 left-0 text-red-700 text-sm">{error}</span>
      )}
    </div>
  );
};