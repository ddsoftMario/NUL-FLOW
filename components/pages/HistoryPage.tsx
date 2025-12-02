
import React from 'react';
import type { NulFlowEntry } from '../../types';
import { ShareIcon } from '../icons';
import { useTranslation } from '../../i18n';

const LevelVisual: React.FC<{ level: number; type: 'bucket' | 'battery' }> = ({ level, type }) => {
    const isBucket = type === 'bucket';
    const color = isBucket
        ? level > 70 ? 'bg-red-500' : level > 40 ? 'bg-yellow-500' : 'bg-blue-500'
        : level < 30 ? 'bg-red-500' : level < 60 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="relative w-12 h-20 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-slate-600 mx-auto">
            <div 
                className={`absolute bottom-0 w-full transition-all duration-500 ${color}`}
                style={{ height: `${level}%` }}
            />
             <div className="absolute top-0 w-full h-1 bg-gray-400 dark:bg-slate-500 rounded-t-sm" />
        </div>
    );
};


const HistoryCard: React.FC<{ entry: NulFlowEntry }> = ({ entry }) => {
    const { t, locale } = useTranslation();
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-slate-700/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="font-semibold text-gray-800 dark:text-slate-200">
                        {entry.timestamp.toLocaleDateString(locale, dateOptions)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        {entry.timestamp.toLocaleTimeString(locale, timeOptions)}
                    </p>
                </div>
                {entry.sharedWith && entry.sharedWith.length > 0 && (
                     <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        <ShareIcon className="w-3 h-3" />
                        <span>{t('history.shared')}</span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{t('history.bucket')}</p>
                    <LevelVisual level={entry.bucketLevel} type="bucket" />
                    <p className="font-bold text-2xl mt-2">{entry.bucketLevel}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t('history.socialLoad')}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">{t('history.battery')}</p>
                    <LevelVisual level={entry.batteryLevel} type="battery" />
                    <p className="font-bold text-2xl mt-2">{entry.batteryLevel}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t('history.energy')}</p>
                </div>
            </div>
            {entry.moods.length > 0 && (
                <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">{t('history.moodTags')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {entry.moods.map(mood => (
                            <span key={mood} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                {t(`moods.${mood}`, {})}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {entry.notes && (
                 <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">{t('history.note')}</h4>
                    <p className="text-sm text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700/80 p-3 rounded-lg">{entry.notes}</p>
                </div>
            )}
        </div>
    );
}

const HistoryPage: React.FC<{ history: NulFlowEntry[] }> = ({ history }) => {
    const { t } = useTranslation();
    const avgBucket = history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.bucketLevel, 0) / history.length) : 0;
    const avgBattery = history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.batteryLevel, 0) / history.length) : 0;

    return (
        <div>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('history.title')}</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('history.description')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-100/70 dark:bg-blue-900/50 backdrop-blur-sm text-blue-800 dark:text-blue-300 p-6 rounded-2xl shadow-sm">
                        <p className="text-sm font-medium opacity-80 mb-1">{t('history.avgBucket')}</p>
                        <p className="text-4xl sm:text-5xl font-bold">{avgBucket}%</p>
                        <p className="text-sm opacity-80">{t('history.bucketAvgDesc')}</p>
                    </div>
                     <div className="bg-green-100/70 dark:bg-green-900/50 backdrop-blur-sm text-green-800 dark:text-green-300 p-6 rounded-2xl shadow-sm">
                        <p className="text-sm font-medium opacity-80 mb-1">{t('history.avgBattery')}</p>
                        <p className="text-4xl sm:text-5xl font-bold">{avgBattery}%</p>
                        <p className="text-sm opacity-80">{t('history.batteryAvgDesc')}</p>
                    </div>
                    <div className="bg-purple-100/70 dark:bg-purple-900/50 backdrop-blur-sm text-purple-800 dark:text-purple-300 p-6 rounded-2xl shadow-sm">
                        <p className="text-sm font-medium opacity-80 mb-1">{t('history.totalEntries')}</p>
                        <p className="text-4xl sm:text-5xl font-bold">{history.length}</p>
                        <p className="text-sm opacity-80">{t('history.totalEntriesDesc')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map(entry => (
                    <HistoryCard key={entry.id} entry={entry} />
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
