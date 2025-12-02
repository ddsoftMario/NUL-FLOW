
import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import type { UserProfile } from '../types';
import { ArrowRightIcon } from './icons';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      onComplete(newProfile);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform -rotate-6">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('profileSetup.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400">{t('profileSetup.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('profileSetup.nameLabel')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('profileSetup.namePlaceholder')}
              required
              className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('profileSetup.emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('profileSetup.phoneLabel')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              required
              className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-purple-700 transition-all transform hover:scale-[1.02]"
            >
              {t('profileSetup.submitButton')}
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
