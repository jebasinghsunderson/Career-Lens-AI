import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { RoleTabs } from '../components/RoleTabs';
import { StudentForm } from '../components/StudentForm';
import { CompanyForm } from '../components/CompanyForm';
import { StudentLogin } from '../components/StudentLogin';
import { CompanyLogin } from '../components/CompanyLogin';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AuthPage = () => {
  const { t } = useLanguage();
  const [activeRole, setActiveRole] = useState<'student' | 'company'>('student');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <AuthLayout>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1" /> {t('auth.backHome')}
        </Link>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-full mb-8 relative">
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out"
          style={{ transform: authMode === 'login' ? 'translateX(0)' : 'translateX(calc(100% + 8px))' }}
        />
        <button
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${authMode === 'login' ? 'text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {t('auth.signIn')}
        </button>
        <button
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${authMode === 'register' ? 'text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {t('auth.signUp')}
        </button>
      </div>

      <RoleTabs activeRole={activeRole} onChange={setActiveRole} />
      
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          {authMode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          {authMode === 'login' 
            ? t('auth.signInDesc') 
            : t('auth.signUpDesc')}
        </p>
      </div>

      <div className="relative">
        {authMode === 'login' ? (
          activeRole === 'student' ? <StudentLogin /> : <CompanyLogin />
        ) : (
          activeRole === 'student' ? <StudentForm /> : <CompanyForm />
        )}
      </div>
    </AuthLayout>
  );
};
