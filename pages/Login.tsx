import React, { useState } from 'react';
import { Lock, User as UserIcon, Mail } from 'lucide-react';
import { UserRole, User } from '../types';
import { LogoIcon } from '../components/Logo';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('admin@bank.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const { t, dir } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      // Handle Registration
      const newUser: User = {
        id: Date.now().toString(),
        name: name || 'New User',
        email: email,
        role: UserRole.USER,
      };
      onLogin(newUser);
    } else {
      // Handle Login (Simulation)
      const userRole = email.includes('admin') ? UserRole.ADMIN : UserRole.USER;
      const loggedInUser: User = {
        id: '1',
        name: userRole === UserRole.ADMIN ? 'System Administrator' : 'John Doe',
        email: email,
        role: userRole,
      };
      onLogin(loggedInUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden transition-colors">
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_70%)]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 backdrop-blur-sm mb-6 shadow-xl border border-slate-700/50">
              <LogoIcon className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">FraudEye</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-widest">
              {isRegistering ? t('auth.registerTitle') : t('auth.loginTitle')}
            </p>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.name')}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                    required={isRegistering}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.email')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.01]"
            >
              {isRegistering ? t('auth.submitRegister') : t('auth.submitLogin')}
            </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
               {isRegistering ? t('auth.haveAccount') : t('auth.noAccount')}
               {' '}
               <button 
                 onClick={() => setIsRegistering(!isRegistering)}
                 className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none underline"
               >
                 {isRegistering ? t('auth.signIn') : t('auth.signUp')}
               </button>
             </p>
             
             {!isRegistering && (
               <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                 {t('auth.adminHint')}
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};