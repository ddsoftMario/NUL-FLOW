
import React, { useState, useMemo } from 'react';
import type { Contact } from '../../types';
import { useTranslation } from '../../i18n';
import { ArrowLeftIcon, PaperAirplaneIcon } from '../icons';

interface RequestFlowPageProps {
  contacts: Contact[];
  onBack: () => void;
}

const RequestFlowPage: React.FC<RequestFlowPageProps> = ({ contacts, onBack }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const requesableContacts = useMemo(() => 
    contacts.filter(c => c.permissions.canRequestState), 
    [contacts]
  );
  
  const filteredContacts = useMemo(() =>
    requesableContacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [requesableContacts, searchTerm]
  );

  const handleToggleContact = (contactId: string) => {
    // Single selection for sharing via native sheet for better UX
    if (selectedContacts.includes(contactId)) {
        setSelectedContacts([]);
    } else {
        setSelectedContacts([contactId]);
    }
  };
  
  const handleSendRequest = async () => {
    if (selectedContacts.length === 0) return;
    setSendStatus('sending');

    // Logic: In a real backend app, this would push a notification.
    // In this standalone PWA, we open the native share sheet so the user can send a message via WhatsApp/SMS.
    
    const contact = contacts.find(c => c.id === selectedContacts[0]);
    const message = `Hey ${contact?.name || ''}, I'm checking in. Could you share your NUL flow status with me?`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'NUL Flow Request',
                text: message,
                url: window.location.href // Or a deep link in a real app
            });
            setSendStatus('sent');
        } catch (err) {
            console.log('Share canceled or failed', err);
            setSendStatus('idle');
        }
    } else {
        // Fallback for desktop/non-share browsers
        alert(`Message copied to clipboard: "${message}"`);
        await navigator.clipboard.writeText(message);
        setSendStatus('sent');
    }

    if (setSendStatus.name !== 'idle') {
        setTimeout(() => {
            setSendStatus('idle');
            setSelectedContacts([]);
        }, 3000);
    }
  };

  return (
    <div>
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 mb-4">
            <ArrowLeftIcon className="w-4 h-4" />
            {t('wizard.buttons.back')}
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('requestFlow.title')}</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('requestFlow.description')}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
          <div className="relative mb-4">
              <input 
                  type="text" 
                  placeholder={t('requestFlow.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="space-y-2">
            {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                    <label key={contact.id} className={`flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${selectedContacts.includes(contact.id) ? 'bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-500' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                        <input 
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleToggleContact(contact.id)}
                            className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                         <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {contact.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-slate-200">{contact.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{contact.group}</p>
                        </div>
                    </label>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500 dark:text-slate-400">
                    <p>{t('requestFlow.noContacts')}</p>
                </div>
            )}
          </div>

          <div className="mt-6">
              <button 
                  onClick={handleSendRequest}
                  disabled={selectedContacts.length === 0 || sendStatus !== 'idle'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                  <PaperAirplaneIcon className="w-5 h-5"/>
                  {sendStatus === 'idle' && t('requestFlow.sendRequest')}
                  {sendStatus === 'sending' && '...'}
                  {sendStatus === 'sent' && t('requestFlow.requestSent')}
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                  (Uses your device's messaging apps to send the request)
              </p>
          </div>
      </div>
    </div>
  );
};

export default RequestFlowPage;
