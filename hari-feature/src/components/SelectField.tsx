import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, icon, error, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 mb-4">
        {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={twMerge(
              clsx(
                "w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none",
                icon && "pl-10",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                className
              )
            )}
            {...props}
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-4 pointer-events-none text-gray-400">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);
SelectField.displayName = 'SelectField';
