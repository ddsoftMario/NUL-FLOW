
import React, { useState, useMemo } from 'react';
import type { NulFlowEntry, Contact } from '../../types';
import { ArrowLeftIcon, PlusIcon, PaperAirplaneIcon } from '../icons';
import { useTranslation } from '../../i18n';

interface ShareSaveStepProps {
  data: Omit<NulFlowEntry, 'id' | 'timestamp'>;
  onUpdate: (updates: Partial<NulFlowEntry>) => void;
  onSave: (entry: Omit<NulFlowEntry, 'id' | 'timestamp'>) => void;
  onBack: () => void;
  contacts: Contact[];
}

const ShareSaveStep: React.FC<ShareSaveStepProps> = ({ data, onUpdate, onSave, onBack, contacts }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const selectedContacts = data.sharedWith || [];
  
  const handleToggleContact = (contactId: string) => {
    const newSelection = selectedContacts.includes(contactId)
      ? selectedContacts.filter(id => id !== contactId)
      : [...selectedContacts, contactId];
    onUpdate({ sharedWith: newSelection });
  };

  const handleSendAndSave = async () => {
    // 1. Save locally first
    onSave({ ...data, sharedWith: selectedContacts });

    // 2. If contacts are selected, try to share via native sheet
    if (selectedContacts.length > 0 && navigator.share) {
        // Construct a text representation
        const moodsText = data.moods.length > 0 ? `Mood: ${data.moods.join(', ')}` : '';
        const notesText = data.notes ? `Note: ${data.notes}` : '';
        const shareText = `My NUL Flow Update:\n🪣 Social Load: ${data.bucketLevel}%\n🔋 Energy: ${data.batteryLevel}%\n${moodsText}\n${notesText}`;

        try {
            await navigator.share({
                title: 'My NUL Flow',
                text: shareText,
                url: window.location.href
            });
        } catch (err) {
            console.log("Share skipped or failed", err);
        }
    }
  };
  
  const filteredContacts = useMemo(() => 
    contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [contacts, searchTerm]
  );
  
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('wizard.shareSave.title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">{t('wizard.shareSave.description')}</p>

      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 text-left" style={{
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 1), rgba(230, 255, 250, 1))',
          boxShadow: '0 0 30px rgba(50, 205, 153, 0.1)'
      }}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4 text-center">{t('wizard.shareSave.shareWithContacts')}</h3>
        
        <div className="relative mb-4">
            <input 
                type="text" 
                placeholder={t('wizard.shareSave.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-teal-300 dark:border-teal-700 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
            {filteredContacts.map(contact => (
                <label key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/50 cursor-pointer">
                    <input 
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleToggleContact(contact.id)}
                        className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                     <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-sm">
                        {contact.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-slate-200">{contact.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{contact.group}</p>
                    </div>
                </label>
            ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 mt-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-semibold">
          <PlusIcon className="w-4 h-4" /> {t('wizard.shareSave.addMoreContacts')}
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button 
          onClick={handleSendAndSave}
          className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
          {selectedContacts.length > 0 ? t('wizard.shareSave.sendToContacts', { count: selectedContacts.length }) : t('wizard.shareSave.saveForMyself')}
        </button>
        <button onClick={onBack} className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 transition-all duration-300">
          <ArrowLeftIcon className="w-5 h-5" />
          {t('wizard.buttons.back')}
        </button>
      </div>
    </div>
  );
};

export default ShareSaveStep;
