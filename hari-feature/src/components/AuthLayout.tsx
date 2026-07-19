import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 via-transparent to-green-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      {/* Left side: Form Panel */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Logo & Header */}
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" 
              alt="India Flag" 
              className="w-12 h-8 rounded-sm shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight">PM Internship Scheme</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Government of India</span>
            </div>
          </div>
          
          {/* Form Card */}
          <div className="glass-panel rounded-2xl shadow-premium p-6 sm:p-8 w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Right side: Illustration Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center p-12 overflow-hidden border-l border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100">
        
        <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
          <div className="mb-6 p-4 bg-white/80 rounded-2xl shadow-xl shadow-slate-200/50 backdrop-blur-sm border border-slate-100">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" 
              alt="India Flag" 
              className="w-16 h-10 rounded-sm"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-800 to-green-600">CareerLens AI</span>
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-lg font-medium">
            The national platform matching top students with leading companies for perfect internship opportunities.
          </p>
          
          {/* Illustration */}
          <div className="relative w-full max-w-lg aspect-[4/3] drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out">
            <img 
              src="/illustration.png" 
              alt="Dashboard interaction illustration" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
