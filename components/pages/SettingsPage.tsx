
import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import type { Theme } from '../../types';

interface SettingsPageProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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


const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme }) => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState({
        bucketOverflow: true,
        lowBattery: true,
        dailyCheckin: false,
        weeklyReports: true,
    });
    const [privacy, setPrivacy] = useState({
        location: false,
        analytics: true,
        crashReporting: true,
    });
    
    const handleThemeToggle = (enabled: boolean) => {
      setTheme(enabled ? 'dark' : 'light');
    };

    return (
        <div>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('settings.title')}</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('settings.description')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <SettingsCard title={t('settings.appearance')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}>
                     <SettingItem title={t('settings.darkMode')} description={t('settings.darkModeDesc')}>
                        <ToggleSwitch enabled={theme === 'dark'} setEnabled={handleThemeToggle} />
                    </SettingItem>
                </SettingsCard>

                <SettingsCard title={t('settings.notifications')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}>
                    <SettingItem title={t('settings.bucketOverflow')} description={t('settings.bucketOverflowDesc')}>
                        <ToggleSwitch enabled={notifications.bucketOverflow} setEnabled={(val) => setNotifications(p => ({...p, bucketOverflow: val}))} />
                    </SettingItem>
                        <SettingItem title={t('settings.lowBattery')} description={t('settings.lowBatteryDesc')}>
                        <ToggleSwitch enabled={notifications.lowBattery} setEnabled={(val) => setNotifications(p => ({...p, lowBattery: val}))} />
                    </SettingItem>
                        <SettingItem title={t('settings.dailyCheckin')} description={t('settings.dailyCheckinDesc')}>
                        <ToggleSwitch enabled={notifications.dailyCheckin} setEnabled={(val) => setNotifications(p => ({...p, dailyCheckin: val}))} />
                    </SettingItem>
                        <SettingItem title={t('settings.weeklyReports')} description={t('settings.weeklyReportsDesc')}>
                        <ToggleSwitch enabled={notifications.weeklyReports} setEnabled={(val) => setNotifications(p => ({...p, weeklyReports: val}))} />
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
                    <div className="pt-4 text-center text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2 justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6.364-8.364l-.707.707M6.343 6.343l.707.707m12.728 0l-.707.707M6.343 17.657l.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {t('settings.dataSecure')}
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
};

export default SettingsPage;
