
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

  const requesableContacts = useMemo(() => 
    contacts.filter(c => c.permissions.canRequestState), 
    [contacts]
  );
  
  const filteredContacts = useMemo(() =>
    requesableContacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [requesableContacts, searchTerm]
  );

  const handleSendSMS = (contact: Contact) => {
    if (!contact.phone) return;
    const message = t('requestFlow.smsTemplate', { name: contact.name });
    // Normalize phone number (remove spaces/dashes) for the link
    const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
    const url = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  const handleSendEmail = (contact: Contact) => {
    if (!contact.email) return;
    const subject = t('requestFlow.emailSubject');
    const body = t('requestFlow.emailBody', { name: contact.name });
    const url = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
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
          <div className="relative mb-6">
              <input 
                  type="text" 
                  placeholder={t('requestFlow.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="space-y-3">
            {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                    <div key={contact.id} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {contact.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-slate-200">{contact.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{contact.group}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                             {contact.phone && (
                                <button 
                                    onClick={() => handleSendSMS(contact)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    SMS
                                </button>
                             )}
                             {contact.email && (
                                <button 
                                    onClick={() => handleSendEmail(contact)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                </button>
                             )}
                             {!contact.phone && !contact.email && (
                                 <span className="text-xs text-gray-400 italic self-center px-2">{t('requestFlow.noContactInfo')}</span>
                             )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500 dark:text-slate-400">
                    <p>{t('requestFlow.noContacts')}</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default RequestFlowPage;
