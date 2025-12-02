
import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';
import { useTranslation } from '../i18n';
import { XMarkIcon } from './icons';

interface EditContactModalProps {
  contact: Contact;
  onSave: (updatedContact: Contact) => void;
  onClose: () => void;
  groups: string[];
}

const EditContactModal: React.FC<EditContactModalProps> = ({ contact, onSave, onClose, groups }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Contact>(contact);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in-slow backdrop-blur-sm">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-md mx-auto shadow-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">{t('contacts.editContact')}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('contacts.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('contacts.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('contacts.phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('contacts.group')}</label>
              <select
                id="group"
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              >
                {groups.map(g => <option key={g} value={g}>{t(`contactGroups.${g}`, { defaultValue: g })}</option>)}
              </select>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all"
            >
              {t('contacts.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 border border-transparent rounded-full shadow-sm text-sm font-medium text-white hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              {t('contacts.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
