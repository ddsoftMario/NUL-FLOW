
import React, { useState, useMemo } from 'react';
import type { NulFlowEntry } from '../../types';
import { DocumentArrowDownIcon } from '../icons';
import { useTranslation } from '../../i18n';
import { INITIAL_MOODS } from '../../constants';

const getEntryPeriodType = (entry: NulFlowEntry): 'good' | 'bad' | 'neutral' => {
  const { bucketLevel, batteryLevel } = entry;
  if (bucketLevel < 40 && batteryLevel > 60) return 'good';
  if (bucketLevel > 70 && batteryLevel < 30) return 'bad';
  return 'neutral';
};

const ExportHistoryCard: React.FC<{ entry: NulFlowEntry }> = ({ entry }) => {
    const { t, locale } = useTranslation();
    const periodType = getEntryPeriodType(entry);
    
    const borderClass = {
        good: 'border-l-4 border-green-500',
        bad: 'border-l-4 border-red-500',
        neutral: 'border-l-4 border-gray-200 dark:border-l-4 dark:border-slate-600',
    }[periodType];

    return (
        <div className={`bg-white dark:bg-slate-700 rounded-lg shadow p-4 flex justify-between items-center transition-all duration-300 ${borderClass}`}>
            <div>
                <p className="font-semibold text-gray-800 dark:text-slate-200">
                    {entry.timestamp.toLocaleDateString(locale === 'en' ? 'en-CA' : locale)} {/* YYYY-MM-DD for en */}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                    {entry.timestamp.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            <div className="flex items-center gap-4 text-sm dark:text-slate-300">
                <span title="Bucket Level">🪣 {entry.bucketLevel}%</span>
                <span title="Battery Level">🔋 {entry.batteryLevel}%</span>
            </div>
            <div className="flex flex-wrap gap-1 max-w-xs">
                {entry.moods.slice(0, 2).map(mood => (
                    <span key={mood} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                        {t(`moods.${mood}`, {})}
                    </span>
                ))}
            </div>
        </div>
    );
};


const DataExportPage: React.FC<{ history: NulFlowEntry[] }> = ({ history }) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<'7d' | '30d' | 'all' | 'custom'>('7d');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sharedOnly, setSharedOnly] = useState(false);
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

    const filteredHistory = useMemo(() => {
        const now = new Date();
        let start: Date | null = new Date();
        let end: Date | null = new Date(now);

        switch(filter) {
            case '7d':
                start.setDate(now.getDate() - 7);
                start.setHours(0, 0, 0, 0);
                break;
            case '30d':
                start.setDate(now.getDate() - 30);
                start.setHours(0, 0, 0, 0);
                break;
            case 'all':
                start = null;
                end = null;
                break;
            case 'custom':
                if (!startDate || !endDate) return [];
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                start = new Date(startDate);
                end = endOfDay;
                break;
        }

        return history.filter(entry => {
            if (start && entry.timestamp < start) return false;
            if (end && entry.timestamp > end) return false;
            if (sharedOnly && (!entry.sharedWith || entry.sharedWith.length === 0)) return false;
            if (selectedMoods.length > 0 && !selectedMoods.some(mood => entry.moods.includes(mood))) return false;
            return true;
        });
    }, [history, filter, startDate, endDate, sharedOnly, selectedMoods]);
    
    const handleExportCSV = () => {
        if (filteredHistory.length === 0) {
            alert("No data to export for the selected period.");
            return;
        }
        
        const headers = ['id', 'timestamp', 'bucketLevel', 'batteryLevel', 'moods', 'notes', 'sharedWith'];
        const csvRows = [headers.join(',')];

        filteredHistory.forEach(entry => {
            const row = [
                entry.id,
                entry.timestamp.toISOString(),
                entry.bucketLevel,
                entry.batteryLevel,
                `"${entry.moods.join('; ')}"`,
                `"${(entry.notes || '').replace(/"/g, '""')}"`,
                `"${(entry.sharedWith || []).join('; ')}"`,
            ];
            csvRows.push(row.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `nul-flow-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('dataExport.title')}</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('dataExport.description')}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
                <div className="flex flex-col gap-4 border-b dark:border-slate-700 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-4">{t('dataExport.selectPeriod')}</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                                <button onClick={() => setFilter('7d')} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${filter === '7d' ? 'bg-white dark:bg-slate-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-slate-600'}`}>{t('dataExport.last7Days')}</button>
                                <button onClick={() => setFilter('30d')} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${filter === '30d' ? 'bg-white dark:bg-slate-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-slate-600'}`}>{t('dataExport.last30Days')}</button>
                                <button onClick={() => setFilter('all')} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-slate-600'}`}>{t('dataExport.allTime')}</button>
                                <button onClick={() => setFilter('custom')} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'custom' ? 'bg-white dark:bg-slate-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-slate-600'}`}>{t('dataExport.custom')}</button>
                            </div>
                            {filter === 'custom' && (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md text-sm"/>
                                    <span className="text-center sm:text-left dark:text-slate-300">{t('dataExport.to')}</span>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md text-sm"/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">{t('dataExport.additionalFilters')}</h3>
                        <div className="flex flex-wrap items-center gap-6">
                             <div className="flex items-center space-x-2">
                                <button
                                  id="sharedOnlyToggle"
                                  onClick={() => setSharedOnly(!sharedOnly)}
                                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${sharedOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}
                                >
                                  <span
                                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${sharedOnly ? 'translate-x-6' : 'translate-x-1'}`}
                                  />
                                </button>
                                <label htmlFor="sharedOnlyToggle" className="text-sm font-semibold text-gray-700 dark:text-slate-300 cursor-pointer">{t('dataExport.sharedOnly')}</label>
                            </div>
                        </div>
                         <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">{t('dataExport.filterByMood')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {INITIAL_MOODS.map(mood => {
                                    const isSelected = selectedMoods.includes(mood);
                                    return (
                                        <button
                                            key={mood}
                                            onClick={() => {
                                                const newMoods = isSelected 
                                                    ? selectedMoods.filter(m => m !== mood)
                                                    : [...selectedMoods, mood];
                                                setSelectedMoods(newMoods);
                                            }}
                                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200 ${
                                                isSelected 
                                                ? 'bg-purple-600 text-white border-purple-600' 
                                                : 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                                            }`}
                                        >
                                            {t(`moods.${mood}`)}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Preview */}
                <div className="pt-4">
                    <h3 className="font-semibold mb-2 dark:text-slate-200">{t('dataExport.entriesFound', { count: filteredHistory.length })}</h3>
                    <div className="space-y-2">
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map(entry => <ExportHistoryCard key={entry.id} entry={entry} />)
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                                <p>{t('dataExport.noEntries')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Export Button */}
                <div className="mt-6">
                    <button 
                        onClick={handleExportCSV}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={filteredHistory.length === 0}
                    >
                        <DocumentArrowDownIcon className="w-5 h-5"/>
                        {t('dataExport.exportCSV')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataExportPage;
