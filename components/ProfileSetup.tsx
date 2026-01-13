
import React, { useState, useRef } from 'react';
import { useTranslation } from '../i18n';
import type { UserProfile, Contact } from '../types';
import { ArrowRightIcon, UsersIcon, DocumentArrowDownIcon } from './icons';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile, contacts: Contact[]) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setStep(2);
    }
  };

  const handleImportContacts = async () => {
    const nav = navigator as any;
    if ('contacts' in nav && nav.contacts) {
      try {
        const props = ['name', 'email', 'tel'];
        const opts = { multiple: true };
        const contacts = await nav.contacts.select(props, opts);
        if (contacts && contacts.length > 0) {
            const mapped: Contact[] = contacts.map((c: any, i: number) => ({
                id: `contact_setup_${Date.now()}_${i}`,
                name: c.name?.[0] || 'Unknown',
                email: c.email?.[0] || '',
                phone: c.tel?.[0] || '',
                group: 'Friend',
                permissions: {
                    canRequestState: false,
                    canSeeBucketLevel: false,
                    canSeeBatteryLevel: false,
                    canSeePrivateNotes: false,
                }
            }));
            setSelectedContacts(mapped);
        }
      } catch (err) {
        console.error("Contact selection failed", err);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          // Simple mock CSV parse logic for local setup
          const dummyContact: Contact = {
              id: `file_contact_${Date.now()}`,
              name: 'Imported Contact',
              group: 'Friend',
              permissions: { canRequestState: false, canSeeBucketLevel: false, canSeeBatteryLevel: false, canSeePrivateNotes: false }
          };
          setSelectedContacts(prev => [...prev, dummyContact]);
      };
      reader.readAsText(file);
  };

  const finishSetup = () => {
    const profile: UserProfile = {
      id: `user_${Date.now()}`,
      ...formData,
      screenName: formData.name,
    };
    onComplete(profile, selectedContacts);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700 rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        
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
                    <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{t('profileSetup.importDescription')}</p>
                        
                        <button 
                            onClick={handleImportContacts}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:border-purple-500 transition-all shadow-sm mb-4"
                        >
                            <UsersIcon className="w-5 h-5 text-purple-600" />
                            {t('profileSetup.importButton')}
                        </button>
                        
                        <div className="relative">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                accept=".csv,.vcf" 
                                className="hidden" 
                            />
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-purple-600 transition-colors"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" />
                                {t('profileSetup.importFromFile')}
                            </button>
                        </div>
                    </div>

                    {selectedContacts.length > 0 && (
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold rounded-xl border border-green-100 dark:border-green-800 animate-bounce">
                           ✨ {t('profileSetup.contactsSelected', {count: selectedContacts.length})}
                        </div>
                    )}

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                          onClick={finishSetup}
                          className="group w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-purple-700 transition-all transform hover:scale-[1.02]"
                        >
                          {t('profileSetup.finishWithContacts')}
                        </button>
                        <button
                            onClick={finishSetup}
                            className="w-full py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors text-sm font-semibold"
                        >
                            {t('profileSetup.skipContacts')}
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
