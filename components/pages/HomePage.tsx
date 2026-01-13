
import React, { useState } from 'react';
import { ArrowRightIcon, UsersIcon, Cog6ToothIcon } from '../icons';
import { useTranslation } from '../../i18n';
import type { Contact, Page } from '../../types';

interface HomePageProps {
  onStartFlow: () => void;
  onRequestFlow: () => void;
  contacts: Contact[];
  onNavigate: (page: Page) => void;
}

const SendFlowCard: React.FC<{ onStart: () => void; hasContacts: boolean; onNavigateToContacts: () => void; }> = ({ onStart, hasContacts, onNavigateToContacts }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center border border-blue-200 dark:border-blue-900 shadow-lg w-full max-w-md mx-auto" style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(220, 230, 255, 0.5))'
        }}>
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('home.sendFlowCardTitle')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{t('home.sendFlowCardDesc')}</p>
            
            {hasContacts ? (
                <button
                    onClick={onStart}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    {t('home.startSharing')}
                    <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            ) : (
                <div className="bg-yellow-100/50 dark:bg-yellow-900/30 p-4 rounded-xl border border-yellow-300 dark:border-yellow-700">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">{t('home.noContactsWarning')}</p>
                    <button
                        onClick={onNavigateToContacts}
                        className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all"
                    >
                        {t('home.addContactsButton')}
                        <UsersIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

const GetFlowCard: React.FC<{ onRequest: () => void }> = ({ onRequest }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center border border-purple-200 dark:border-purple-900 shadow-lg w-full max-w-md mx-auto" style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(240, 230, 255, 0.5))'
        }}>
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('home.getFlowCardTitle')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{t('home.getFlowCardDesc')}</p>
            <button 
                onClick={onRequest}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white font-semibold rounded-full shadow-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105">
                {t('home.requestUpdates')}
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ onStartFlow, onRequestFlow, contacts, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'send' | 'get'>('send');
    const { t } = useTranslation();
    const hasContacts = contacts.length > 0;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center relative">
            <button 
                onClick={() => onNavigate('settings')}
                className="absolute top-0 right-0 p-3 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                title={t('nav.settings')}
            >
                <Cog6ToothIcon className="w-6 h-6" />
            </button>

            <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400 tracking-tighter mb-4">NUL flow</h1>
                <p className="text-xl sm:text-2xl font-medium text-purple-600 dark:text-purple-400 mt-2">{t('home.subtitle')}</p>
                <p className="text-lg text-slate-500 dark:text-slate-300 mt-4 max-w-md mx-auto">{t('home.tagline')}</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full shadow-md mb-12 flex items-center space-x-2">
                <button
                    onClick={() => setActiveTab('send')}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === 'send' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <span className="mr-2">📤</span> {t('home.sendFlow')}
                </button>
                <button
                    onClick={() => setActiveTab('get')}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === 'get' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <span className="mr-2">📥</span> {t('home.getFlow')}
                </button>
            </div>
            
            <div className="w-full">
                {activeTab === 'send' ? <SendFlowCard onStart={onStartFlow} hasContacts={hasContacts} onNavigateToContacts={() => onNavigate('contacts')} /> : <GetFlowCard onRequest={onRequestFlow} />}
            </div>
        </div>
    );
};

export default HomePage;
