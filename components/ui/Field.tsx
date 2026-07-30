"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export const inputCls =
  "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-500">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-ink-300">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Select({
  children,
  className,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={`${inputCls} ${className ?? ""}`}>
      {children}
    </select>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`${inputCls} ${props.className ?? ""}`}
    />
  );
}

// Para girişi: rakamlar yazılırken binlik ayraçla gösterilir,
// değere yalnızca rakamlar iletilir.
export function MoneyInput({
  value,
  onValueChange,
  placeholder,
}: {
  value: string;
  onValueChange: (digits: string) => void;
  placeholder?: string;
}) {
  const display = value
    ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "";
  return (
    <input
      inputMode="numeric"
      value={display}
      placeholder={placeholder}
      onChange={(e) => onValueChange(e.target.value.replace(/\D/g, ""))}
      className={`${inputCls} tabular`}
    />
  );
}
