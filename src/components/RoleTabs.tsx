import React from 'react';
import clsx from 'clsx';

type Role = 'student' | 'company';

interface RoleTabsProps {
  activeRole: Role;
  onChange: (role: Role) => void;
}

export const RoleTabs: React.FC<RoleTabsProps> = ({ activeRole, onChange }) => {
  return (
    <div className="flex items-center gap-6 mb-6 border-b border-gray-100 pb-2">
      <button
        onClick={() => onChange('student')}
        className={clsx(
          "pb-2 text-lg font-bold transition-all relative",
          activeRole === 'student' 
            ? "text-slate-900" 
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        Student
        {activeRole === 'student' && (
          <span className="absolute bottom-[-9px] left-0 w-full h-[3px] bg-blue-800 rounded-t-full" />
        )}
      </button>
      <button
        onClick={() => onChange('company')}
        className={clsx(
          "pb-2 text-lg font-bold transition-all relative",
          activeRole === 'company' 
            ? "text-slate-900" 
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        Company
        {activeRole === 'company' && (
          <span className="absolute bottom-[-9px] left-0 w-full h-[3px] bg-blue-800 rounded-t-full" />
        )}
      </button>
    </div>
  );
};
