
import React from 'react';
import { useTranslation } from '../../i18n';
import { DocumentArrowDownIcon } from '../icons';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  const handleExport = (format: 'csv' | 'xlsx') => {
    // Direct window location change for file download with session credentials
    // Note: window.location.href handles browser downloads normally if the endpoint returns correct headers.
    window.location.href = `/api/admin/users.${format}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('nav.admin')}</h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('admin.description')}</p>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700 shadow-xl text-center">
        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
           <DocumentArrowDownIcon className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('admin.exportTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          {t('admin.exportNote')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:border-purple-500 transition-all shadow-sm"
          >
            <span className="text-lg">CSV</span>
            {t('admin.downloadCsv')}
          </button>
          
          <button
            onClick={() => handleExport('xlsx')}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
          >
            <span className="text-lg">Excel</span>
            {t('admin.downloadExcel')}
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
           <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              {t('admin.privacyBanner')}
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
