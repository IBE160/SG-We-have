'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface Option {
  id: string
  name: string
  [key: string]: any
}

interface CustomSelectProps<T extends Option> {
  value: T | null
  onChange: (value: T) => void
  options: T[]
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  dropdownPosition?: 'anchor' | 'absolute'
}

export default function CustomSelect<T extends Option>({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  dropdownPosition = 'anchor',
}: CustomSelectProps<T>) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative mt-1">
          <ListboxButton className={clsx(
            "relative w-full cursor-default rounded-md bg-card py-1.5 pl-3 pr-10 text-left border border-border-light shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue sm:text-sm text-text-primary",
            disabled && "opacity-50 cursor-not-allowed bg-sidebar-hover"
          )}>
            <span className={clsx("block truncate", !value && "text-text-secondary")}>
              {value ? value.name : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className="h-4 w-4 text-text-secondary"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <ListboxOptions
            anchor={dropdownPosition === 'anchor' ? { to: 'bottom start', gap: 4 } : undefined}
            transition
            className={clsx(
              "z-50 max-h-60 overflow-auto rounded-md bg-card py-1 text-base shadow-soft ring-1 ring-border-light focus:outline-none sm:text-sm transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 border border-border-light",
              dropdownPosition === 'anchor' ? "w-[var(--button-width)]" : "absolute top-full left-0 mt-1 w-full"
            )}
          >
            {options.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-text-secondary italic">
                    No options available
                </div>
            ) : (
                options.map((option) => (
                <ListboxOption
                    key={option.id}
                    value={option}
                    className="group relative cursor-default select-none py-2 pl-10 pr-4 text-text-primary data-[focus]:bg-accent-blue/10 data-[focus]:text-accent-blue"
                >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {option.name}
                    </span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent-blue opacity-0 group-data-[selected]:opacity-100">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                </ListboxOption>
                ))
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}
