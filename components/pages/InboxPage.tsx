
import React from 'react';
import type { Contact } from '../../types';
import type { InboxItem } from '../../App'; // Import the type
import { useTranslation } from '../../i18n';

interface InboxPageProps {
  inboxItems: InboxItem[];
  contacts: Contact[];
}

const LevelBar: React.FC<{ value: number; colorClass: string; label: string }> = ({ value, colorClass, label }) => (
  <div className="flex-1">
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-bold text-slate-800 dark:text-slate-200">{value}%</span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const InboxItemCard: React.FC<{ item: InboxItem; sender?: Contact }> = ({ item, sender }) => {
    const { t, locale } = useTranslation();
    const senderName = sender ? sender.name : "Unknown";
    const senderInitial = senderName.charAt(0);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 mb-4 animate-fade-in-slow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                        {senderInitial}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">{senderName}</h3>
                        <p className="text-xs text-slate-500">
                             {item.timestamp.toLocaleDateString(locale, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                )}
            </div>

            <div className="flex gap-4 mb-4">
                <LevelBar value={item.bucketLevel} colorClass="bg-blue-500" label={t('history.bucket')} />
                <LevelBar value={item.batteryLevel} colorClass="bg-green-500" label={t('history.battery')} />
            </div>

            {item.moods.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {item.moods.map(mood => (
                        <span key={mood} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded text-xs font-medium">
                            {t(`moods.${mood}`, { defaultValue: mood })}
                        </span>
                    ))}
                </div>
            )}
            
            {item.notes && (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 italic">
                    "{item.notes}"
                </div>
            )}
        </div>
    );
};

const InboxPage: React.FC<InboxPageProps> = ({ inboxItems, contacts }) => {
    const { t } = useTranslation();

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 mt-10">
             <div className="w-32 h-32 rounded-full bg-purple-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('inbox.emptyTitle')}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                {t('inbox.emptyDesc')}
            </p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6">{t('nav.inbox')}</h1>
            
            {inboxItems.length === 0 ? renderEmptyState() : (
                <div className="space-y-4">
                    {inboxItems.map(item => (
                        <InboxItemCard 
                            key={item.id} 
                            item={item} 
                            sender={contacts.find(c => c.id === item.senderId)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default InboxPage;
