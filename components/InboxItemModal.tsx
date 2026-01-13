
import React from 'react';
import type { Contact } from '../types';
import type { InboxItem } from '../App';
import { useTranslation } from '../i18n';
import LevelBar from './LevelBar';
import { XMarkIcon } from './icons';

interface InboxItemModalProps {
  item: InboxItem;
  sender?: Contact;
  onClose: () => void;
}

const InboxItemModal: React.FC<InboxItemModalProps> = ({ item, sender, onClose }) => {
    const { t, locale } = useTranslation();
    const isSystemMessage = item.senderId === 'nul_flow_team';
    const senderName = isSystemMessage ? t('inbox.fromNulFlowTeam') : sender ? sender.name : "Unknown";
    const senderInitial = isSystemMessage ? 'N' : senderName.charAt(0);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in-slow">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-md mx-auto shadow-2xl relative">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${isSystemMessage ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'}`}>
                            {senderInitial}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{senderName}</h3>
                            <p className="text-sm text-slate-500">
                                {item.timestamp.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 mb-5">
                        <LevelBar value={item.bucketLevel} colorClass="bg-blue-500" label={t('history.bucket')} />
                        <LevelBar value={item.batteryLevel} colorClass="bg-green-500" label={t('history.battery')} />
                    </div>

                    {item.moods.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">{t('history.moodTags')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {item.moods.map(mood => (
                                    <span key={mood} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                        {t(`moods.${mood}`, {})}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {item.notes && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">{t('history.note')}</h4>
                            <p className="text-sm text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700/80 p-3 rounded-lg whitespace-pre-wrap">
                                {item.notes}
                            </p>
                        </div>
                    )}

                </div>
                 <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full text-gray-400 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default InboxItemModal;
