
import React from 'react';
import { useTranslation } from '../i18n';

interface WelcomeOverlayProps {
  onClose: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-slow">
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-lg mx-auto shadow-2xl p-8 text-center flex flex-col items-center">
        
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t('onboarding.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          {t('onboarding.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
          {/* Bucket Explanation */}
          <div className="bg-blue-50/50 dark:bg-blue-900/30 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{t('onboarding.bucketTitle')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('onboarding.bucketDesc')}</p>
          </div>
          
          {/* Battery Explanation */}
          <div className="bg-green-50/50 dark:bg-green-900/30 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">{t('onboarding.batteryTitle')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('onboarding.batteryDesc')}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105"
        >
          {t('onboarding.closeButton')}
        </button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
