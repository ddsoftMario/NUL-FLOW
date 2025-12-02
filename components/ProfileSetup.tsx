
import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import type { UserProfile, Contact } from '../types';
import { ArrowRightIcon, UsersIcon } from './icons';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile, contacts: Contact[]) => void;
}

// Helper to access the native contacts API
declare global {
  interface Navigator {
    contacts?: {
      select: (properties: string[], options?: { multiple: boolean }) => Promise<any[]>;
    };
  }
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [importedContacts, setImportedContacts] = useState<Contact[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      setStep(2);
    }
  };

  const handleImportContacts = async () => {
    if ('contacts' in navigator && navigator.contacts) {
      try {
        const props = ['name', 'email', 'tel'];
        const opts = { multiple: true };
        
        const contacts = await navigator.contacts.select(props, opts);
        
        if (contacts && contacts.length > 0) {
           const formattedContacts: Contact[] = contacts.map((c: any, index: number) => ({
             id: `imported_${Date.now()}_${index}`,
             name: c.name?.[0] || 'Unknown',
             email: c.email?.[0] || '',
             phone: c.tel?.[0] || '',
             group: 'Friend', // Default group
             permissions: {
                canRequestState: false,
                canSeeBucketLevel: false,
                canSeeBatteryLevel: false,
                canSeePrivateNotes: false,
             }
           }));
           
           setImportedContacts(prev => [...prev, ...formattedContacts]);
        }
      } catch (ex) {
        console.error("Contacts import failed or was cancelled", ex);
        // Fallback or just ignore if user cancelled
      }
    } else {
      alert(t('profileSetup.importNotSupported'));
    }
  };

  const finishSetup = () => {
      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      onComplete(newProfile, importedContacts);
  };

  const isContactsApiSupported = 'contacts' in navigator && navigator.contacts;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700 rounded-3xl shadow-2xl p-8">
        
        {/* Progress Dots */}
        <div className="flex justify-center mb-6 space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step >= 1 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`} />
        </div>

        {step === 1 && (
            <>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform -rotate-6">
                        <span className="text-3xl">👋</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('profileSetup.title')}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('profileSetup.subtitle')}</p>
                </div>

                <form onSubmit={handleInfoSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('profileSetup.nameLabel')}
                    </label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('profileSetup.namePlaceholder')}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('profileSetup.emailLabel')}
                    </label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('profileSetup.phoneLabel')}
                    </label>
                    <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                </div>

                <div className="pt-4">
                    <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-purple-700 transition-all transform hover:scale-[1.02]"
                    >
                    {t('profileSetup.nextStep')}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                </form>
            </>
        )}

        {step === 2 && (
             <>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
                        <UsersIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('profileSetup.contactsTitle')}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('profileSetup.contactsSubtitle')}</p>
                </div>

                <div className="space-y-6">
                    {isContactsApiSupported ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                {t('profileSetup.importDescription')}
                            </p>
                            <button 
                                onClick={handleImportContacts}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all"
                            >
                                {t('profileSetup.importButton')}
                            </button>
                        </div>
                    ) : (
                         <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                {t('profileSetup.manualEntryNote')}
                            </p>
                        </div>
                    )}

                    {importedContacts.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                {t('profileSetup.contactsSelected', { count: importedContacts.length })}
                            </p>
                        </div>
                    )}

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                        onClick={finishSetup}
                        className="group w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-purple-700 transition-all transform hover:scale-[1.02]"
                        >
                        {importedContacts.length > 0 ? t('profileSetup.finishWithContacts') : t('profileSetup.skipContacts')}
                        </button>
                    </div>
                </div>
             </>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
