
import React, { useState, useMemo } from 'react';
import type { NulFlowEntry, Contact } from '../../types';
import { ArrowLeftIcon, PlusIcon, PaperAirplaneIcon, ShareIcon } from '../icons';
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

  const getShareText = () => {
    // Translate moods for the message
    const translatedMoods = data.moods.map(m => t(`moods.${m}`, { defaultValue: m })).join(', ');
    
    // Construct the message using translations
    return t('share.messageTemplate', {
        bucket: data.bucketLevel,
        battery: data.batteryLevel,
        moods: translatedMoods ? `\nMood: ${translatedMoods}` : '',
        notes: data.notes ? `\nNote: ${data.notes}` : ''
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
        try {
            const shareData: any = {
                title: 'My NUL Flow',
                text: getShareText(),
            };
            // Ensure we don't pass 'about:srcdoc' or other invalid URLs that cause "Invalid URL" errors
            if (window.location.href && window.location.href.startsWith('http')) {
                shareData.url = window.location.href;
            }
            
            await navigator.share(shareData);
        } catch (err) {
            console.log("Share skipped or failed", err);
        }
    }
  };

  const handleSendSMS = (contact: Contact) => {
    if (!contact.phone) return;
    const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
    const url = `sms:${cleanPhone}?body=${encodeURIComponent(getShareText())}`;
    window.location.href = url;
  };

  const handleSendEmail = (contact: Contact) => {
    if (!contact.email) return;
    const subject = t('share.emailSubject', { defaultValue: 'My NUL Flow Update'});
    const url = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getShareText())}`;
    window.location.href = url;
  };

  const handleSaveAndFinish = () => {
      onSave({ ...data, sharedWith: selectedContacts });
  };
  
  const filteredContacts = useMemo(() => 
    contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [contacts, searchTerm]
  );
  
  const selectedContactObjects = contacts.filter(c => selectedContacts.includes(c.id));

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('wizard.shareSave.title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">{t('wizard.shareSave.description')}</p>

      {/* Contact Selection Area */}
      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 text-left mb-6" style={{
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 1), rgba(230, 255, 250, 1))',
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

        <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
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
      </div>

      {/* Direct Actions Area */}
      {selectedContactObjects.length > 0 && (
          <div className="mb-6 bg-blue-50 dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Send Now</h4>
              <div className="space-y-3">
                  {selectedContactObjects.map(c => (
                      <div key={c.id} className="flex items-center justify-between text-sm bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm">
                          <span className="font-medium text-gray-800 dark:text-white truncate max-w-[40%]">{c.name}</span>
                          <div className="flex gap-2">
                              {c.phone && (
                                  <button onClick={() => handleSendSMS(c)} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 text-xs font-bold">
                                      SMS
                                  </button>
                              )}
                              {c.email && (
                                  <button onClick={() => handleSendEmail(c)} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 text-xs font-bold">
                                      Email
                                  </button>
                              )}
                              {!c.phone && !c.email && <span className="text-gray-400 text-xs">No info</span>}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Footer Buttons */}
      <div className="flex flex-col gap-3">
        {navigator.share && (
             <button 
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
              >
              <ShareIcon className="w-5 h-5" />
              {t('shareApp')}
            </button>
        )}
      
        <button 
          onClick={handleSaveAndFinish}
          className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          {t('wizard.shareSave.saveForMyself')} {/* Used as generic 'Finish' */}
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
