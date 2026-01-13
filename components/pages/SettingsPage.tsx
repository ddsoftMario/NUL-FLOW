
import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import type { Theme, UserProfile } from '../../types';
import type { NotificationSettings } from '../../App';
import { InstallIcon, ArrowLeftIcon } from '../icons';

// Fixed: Added onBack to SettingsPageProps to match the usage in App.tsx
interface SettingsPageProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  notifications: NotificationSettings;
  setNotifications: (settings: NotificationSettings) => void;
  canInstall: boolean;
  onInstall: () => void;
  onBack: () => void;
}

const ToggleSwitch: React.FC<{ enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ enabled, setEnabled }) => (
    <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors duration-300 focus:outline-none ${enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`}
    >
        <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/30 dark:border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-purple-600 dark:text-purple-400">{icon}</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">{title}</h2>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SettingItem: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
            <p className="font-semibold text-gray-700 dark:text-slate-300">{title}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="flex-shrink-0">
            {children}
        </div>
    </div>
);


const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme, userProfile, onUpdateProfile, onResetData, notifications, setNotifications, canInstall, onInstall, onBack }) => {
    const { t } = useTranslation();
    const [screenNameInput, setScreenNameInput] = useState(userProfile.screenName || userProfile.name);
    const [showIosHelp, setShowIosHelp] = useState(false);

    const [privacy, setPrivacy] = useState({
        location: false,
        analytics: true,
        crashReporting: true,
    });
    
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    ) && !(window as any).MSStream;

    const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    
    const handleThemeToggle = (enabled: boolean) => {
      setTheme(enabled ? 'dark' : 'light');
    };

    const handleSaveScreenName = () => {
        onUpdateProfile({ ...userProfile, screenName: screenNameInput });
    };

    const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
        setNotifications({ ...notifications, [key]: value });
    };
    
    const handleInstallClick = () => {
        if (canInstall) {
            onInstall();
        } else if (isIOS) {
            setShowIosHelp(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Added: Back button for consistent navigation and fixing TS error */}
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 mb-4">
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t('wizard.buttons.back')}
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('settings.title')}</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('settings.description')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {!isStandalone && (
                    <SettingsCard title={t('settings.installTitle')} icon={<InstallIcon className="h-6 w-6" />}>
                        <div className="flex flex-col gap-3">
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                {t('settings.installDesc')}
                            </p>
                            <button 
                                onClick={handleInstallClick}
                                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all active:scale-95"
                            >
                                {t('settings.installButton')}
                            </button>
                        </div>
                    </SettingsCard>
                )}

                <SettingsCard title={t('settings.profile')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <SettingItem title={t('settings.screenName')} description={t('settings.screenNameDesc')}>
                       <div className="flex items-center gap-2">
                         <input 
                            type="text"
                            value={screenNameInput}
                            onChange={(e) => setScreenNameInput(e.target.value)}
                            className="w-40 px-3 py-1.5 border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm dark:text-white"
                         />
                         <button onClick={handleSaveScreenName} className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors">{t('contacts.save')}</button>
                       </div>
                    </SettingItem>
                </SettingsCard>

                <SettingsCard title={t('settings.appearance')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}>
                     <SettingItem title={t('settings.darkMode')} description={t('settings.darkModeDesc')}>
                        <ToggleSwitch enabled={theme === 'dark'} setEnabled={handleThemeToggle} />
                    </SettingItem>
                </SettingsCard>

                <SettingsCard title={t('settings.notifications')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}>
                    <SettingItem title={t('settings.bucketOverflow')} description={t('settings.bucketOverflowDesc')}>
                        <ToggleSwitch enabled={notifications.bucketOverflow} setEnabled={(val) => updateNotification('bucketOverflow', val)} />
                    </SettingItem>
                        <SettingItem title={t('settings.lowBattery')} description={t('settings.lowBatteryDesc')}>
                        <ToggleSwitch enabled={notifications.lowBattery} setEnabled={(val) => updateNotification('lowBattery', val)} />
                    </SettingItem>
                        <SettingItem title={t('settings.dailyCheckin')} description={t('settings.dailyCheckinDesc')}>
                        <ToggleSwitch enabled={notifications.dailyCheckin} setEnabled={(val) => updateNotification('dailyCheckin', val)} />
                    </SettingItem>
                        <SettingItem title={t('settings.weeklyReports')} description={t('settings.weeklyReportsDesc')}>
                        <ToggleSwitch enabled={notifications.weeklyReports} setEnabled={(val) => updateNotification('weeklyReports', val)} />
                    </SettingItem>
                </SettingsCard>

                <SettingsCard title={t('settings.privacy')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
                    <SettingItem title={t('settings.shareLocation')} description={t('settings.shareLocationDesc')}>
                        <ToggleSwitch enabled={privacy.location} setEnabled={(val) => setPrivacy(p => ({...p, location: val}))} />
                    </SettingItem>
                    <SettingItem title={t('settings.analytics')} description={t('settings.analyticsDesc')}>
                        <ToggleSwitch enabled={privacy.analytics} setEnabled={(val) => setPrivacy(p => ({...p, analytics: val}))} />
                    </SettingItem>
                    <SettingItem title={t('settings.crashReporting')} description={t('settings.crashReportingDesc')}>
                        <ToggleSwitch enabled={privacy.crashReporting} setEnabled={(val) => setPrivacy(p => ({...p, crashReporting: val}))} />
                    </SettingItem>
                </SettingsCard>

                <SettingsCard title={t('settings.dataManagement')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8 5 8-5M12 12l8 5" /></svg>}>
                    <SettingItem title={t('settings.resetData')} description={t('settings.resetDataDesc')}>
                        <button onClick={onResetData} className="px-4 py-2 bg-red-600/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-600/20 dark:border-red-500/30 rounded-lg text-sm font-semibold hover:bg-red-600/20 dark:hover:bg-red-500/30 transition-colors">
                            {t('settings.resetButton')}
                        </button>
                    </SettingItem>
                </SettingsCard>
            </div>

            {showIosHelp && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[32px] p-8 space-y-4 shadow-2xl">
                    <div className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Add to Home Screen</div>
                    <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-4 list-decimal list-inside">
                    <li>Open the <b>Share</b> menu (square with arrow icon).</li>
                    <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
                    <li>Tap <b>Add</b> in the top right corner.</li>
                    </ol>
                    <button
                    onClick={() => setShowIosHelp(false)}
                    className="w-full bg-slate-900 dark:bg-purple-600 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-widest mt-4 hover:opacity-90 transition-opacity"
                    >
                    Got it
                    </button>
                </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
