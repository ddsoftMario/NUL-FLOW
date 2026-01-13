
import React from 'react';
import { useTranslation } from '../i18n';
import { InstallIcon, ShareAppIcon, XMarkIcon } from './icons';

interface InstallPwaBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
  canInstall: boolean;
}

const InstallPwaBanner: React.FC<InstallPwaBannerProps> = ({ onInstall, onDismiss, canInstall }) => {
    const { t } = useTranslation();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Determine if any banner should be shown at all
    const shouldShowAndroidBanner = canInstall && !isIOS;
    const shouldShowIOSBanner = isIOS;

    if (!shouldShowAndroidBanner && !shouldShowIOSBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[60] animate-fade-in-slow">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 max-w-2xl mx-auto">
                {shouldShowAndroidBanner && (
                    <>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <InstallIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {t('installBanner.prompt')}
                            </p>
                        </div>
                        <button onClick={onInstall} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg text-sm whitespace-nowrap hover:bg-purple-700 transition-colors">
                            {t('installBanner.installButton')}
                        </button>
                    </>
                )}

                {shouldShowIOSBanner && (
                     <>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ShareAppIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {t('installBanner.iosPrompt')}
                            </p>
                        </div>
                    </>
                )}

                <button onClick={onDismiss} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors self-start">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default InstallPwaBanner;
