import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, icon, error, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5 mb-4">
        {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={twMerge(
              clsx(
                "w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
                icon && "pl-10",
                isPassword && "pr-10",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                className
              )
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);
FormField.displayName = 'FormField';
