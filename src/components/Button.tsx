import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={twMerge(
        clsx(
          "w-full rounded-full bg-gradient-to-r from-blue-800 to-indigo-900 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-900 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-blue-800/50 active:scale-[0.98]",
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
