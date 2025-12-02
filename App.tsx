
import React, { useState, useEffect, useCallback } from 'react';
import { HomeIcon, InboxIcon, ClockIcon, UsersIcon, Cog6ToothIcon, XMarkIcon, Bars3Icon, DocumentArrowDownIcon, InstallIcon, ShareAppIcon } from './components/icons';
import type { Page, NulFlowEntry, Contact, Theme, UserProfile } from './types';
import { MOCK_CONTACTS } from './constants';
import HomePage from './components/pages/HomePage';
import InboxPage from './components/pages/InboxPage';
import HistoryPage from './components/pages/HistoryPage';
import ContactsPage from './components/pages/ContactsPage';
import SettingsPage from './components/pages/SettingsPage';
import DataExportPage from './components/pages/DataExportPage';
import RequestFlowPage from './components/pages/RequestFlowPage';
import NulFlowWizard from './components/flow/NulFlowWizard';
import WelcomeOverlay from './components/WelcomeOverlay';
import ProfileSetup from './components/ProfileSetup';
import { checkCrisisPattern } from './services/geminiService';
import { useTranslation, LANGUAGES } from './i18n';


// Extend the Window interface to include the BeforeInstallPromptEvent
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

// Interface for Inbox items (received flows)
export interface InboxItem extends NulFlowEntry {
  senderId: string;
  isRead: boolean;
}

const App: React.FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSendingFlow, setIsSendingFlow] = useState(false);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('nul-flow-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) { return null; }
  });

  const [history, setHistory] = useState<NulFlowEntry[]>(() => {
    try {
      const savedHistory = localStorage.getItem('nul-flow-history');
      if (savedHistory) {
        return JSON.parse(savedHistory).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
      }
    } catch (error) { console.error("Failed to load history from localStorage", error); }
    // Start from scratch for new users
    return [];
  });
  
  const [contacts, setContacts] = useState<Contact[]>(() => {
      try {
          const savedContacts = localStorage.getItem('nul-flow-contacts');
          return savedContacts ? JSON.parse(savedContacts) : MOCK_CONTACTS;
      } catch (error) { console.error("Failed to load contacts from localStorage", error); }
      return MOCK_CONTACTS;
  });

  // State for received messages (Inbox)
  const [inbox, setInbox] = useState<InboxItem[]>([]);

  const [crisisAlert, setCrisisAlert] = useState<boolean>(false);
  const [showCrisisModal, setShowCrisisModal] = useState<boolean>(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // DEMO SIMULATION: Receive a message from a contact after 3 seconds
  useEffect(() => {
    // Only simulate if user is logged in
    if (userProfile && inbox.length === 0) {
      const timer = setTimeout(() => {
        const mario = contacts.find(c => c.name === 'Mario') || contacts[2];
        if (mario) {
          const newMsg: InboxItem = {
            id: `inbox_${Date.now()}`,
            timestamp: new Date(),
            bucketLevel: 80,
            batteryLevel: 45,
            moods: ['stressed', 'focused'],
            senderId: mario.id,
            isRead: false,
            notes: "Big deadline coming up. Heads down."
          };
          setInbox([newMsg]);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [inbox.length, contacts, userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('nul-flow-history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('nul-flow-contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error("Failed to save contacts to localStorage", error);
    }
  }, [contacts]);


  useEffect(() => {
    const savedTheme = localStorage.getItem('nul-flow-theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
    
    // Only show onboarding if user is logged in and hasn't seen it
    if (userProfile) {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding !== 'true') {
            setShowOnboarding(true);
        }
    }
  }, [userProfile]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('nul-flow-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (navigator.share) {
      setCanShare(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleExecuteDelete = () => {
    if (contactToDelete) {
        setContacts(prev => prev.filter(c => c.id !== contactToDelete));
        setContactToDelete(null);
    }
  };

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setInstallPromptEvent(null);
      });
    }
  };
  
  const handleShareClick = () => {
    if (navigator.share) {
        navigator.share({
            title: 'NUL flow',
            text: t('share.text'),
            url: window.location.href,
        }).catch(console.error);
    }
  };


  const contactGroups = [...new Set(contacts.map(c => c.group))].sort();

  const handleCreateGroup = (newGroupName: string) => {
    console.log(`Group "${newGroupName}" is now available.`);
  };

  const handleStartFlow = () => {
    setIsSendingFlow(true);
  };
  
  const handleRequestFlow = () => {
    setPage('request-flow');
  };

  const handleCloseFlow = () => {
    setIsSendingFlow(false);
  };

  const handleSaveFlow = (entry: Omit<NulFlowEntry, 'id' | 'timestamp'>) => {
    const newEntry: NulFlowEntry = {
      ...entry,
      id: `flow_${Date.now()}`,
      timestamp: new Date(),
    };
    setHistory(prev => [newEntry, ...prev]);
    setIsSendingFlow(false);
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('nul-flow-user', JSON.stringify(profile));
    // Trigger onboarding after profile setup
    setTimeout(() => {
        setShowOnboarding(true);
    }, 500);
  };
  
  const analyzeHistory = useCallback(async () => {
    if (history.length > 2) {
      try {
        const isCrisis = await checkCrisisPattern(history.slice(0, 5));
        if (isCrisis) {
          setCrisisAlert(true);
          setShowCrisisModal(true);
        }
      } catch (error) {
        console.error("Error checking crisis pattern:", error);
      }
    }
  }, [history]);

  const handleCloseOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };
  
  useEffect(() => {
      analyzeHistory();
  }, [history, analyzeHistory]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onStartFlow={handleStartFlow} onRequestFlow={handleRequestFlow} />;
      case 'inbox':
        return <InboxPage inboxItems={inbox} contacts={contacts} />;
      case 'history':
        return <HistoryPage history={history} />;
      case 'contacts':
        return <ContactsPage contacts={contacts} setContacts={setContacts} contactGroups={contactGroups} onCreateGroup={handleCreateGroup} onConfirmDelete={setContactToDelete} />;
      case 'settings':
        return <SettingsPage theme={theme} setTheme={setTheme} />;
      case 'data-export':
        return <DataExportPage history={history} />;
      case 'request-flow':
        return <RequestFlowPage contacts={contacts} onBack={() => setPage('home')} />;
      default:
        return <HomePage onStartFlow={handleStartFlow} onRequestFlow={handleRequestFlow} />;
    }
  };

  const CrisisModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-sm text-center shadow-2xl shadow-red-500/20">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
          <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{t('crisisModal.title')}</h3>
        <div className="mt-2 px-4 text-sm text-slate-600 dark:text-slate-300">
          <p>{t('crisisModal.description1')}</p>
          <p className="mt-2">{t('crisisModal.description2')}</p>
        </div>
        <div className="mt-6 space-y-2">
          <button
            onClick={() => setShowCrisisModal(false)}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {t('crisisModal.notifyButton')}
          </button>
          <button
            onClick={() => setShowCrisisModal(false)}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('crisisModal.dismissButton')}
          </button>
        </div>
      </div>
    </div>
  );
  
  const ConfirmDeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in-slow">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-w-sm text-center shadow-2xl shadow-red-500/20">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('contacts.confirmDeleteTitle')}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('contacts.confirmDeleteMessage')}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => setContactToDelete(null)} className="px-6 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all">
            {t('contacts.cancel')}
          </button>
          <button onClick={handleExecuteDelete} className="px-6 py-2 bg-red-600 border border-transparent rounded-full shadow-sm text-sm font-medium text-white hover:bg-red-700 transition-all">
            {t('contacts.delete')}
          </button>
        </div>
      </div>
    </div>
  );

  const NavItem: React.FC<{ icon: React.ReactNode; label: string; pageName: Page; badgeCount?: number }> = ({ icon, label, pageName, badgeCount }) => (
    <li>
      <button 
        onClick={() => {
          setPage(pageName);
          setSidebarOpen(false);
        }}
        className={`flex items-center p-3 w-full text-base font-normal rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-purple-500 ${
          page === pageName 
          ? 'bg-white/60 dark:bg-slate-700/80 text-slate-900 dark:text-white shadow-lg' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50'
        }`}
      >
        <div className="w-6 h-6">{icon}</div>
        <span className="ml-3 flex-1 text-left whitespace-nowrap">{label}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
           <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{badgeCount}</span>
        )}
      </button>
    </li>
  );
  
  const ExtraNavItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; visible?: boolean }> = ({ icon, label, onClick, visible = true }) => {
    if (!visible) return null;
    return (
        <button onClick={onClick} className="flex items-center p-3 w-full text-sm font-normal rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-purple-500">
            <div className="w-5 h-5">{icon}</div>
            <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
        </button>
    );
  };

  // 1. Mandatory Profile Setup Check
  if (!userProfile) {
    return (
      <>
        <ProfileSetup onComplete={handleProfileComplete} />
        {/* We mount a minimal structure to hold the language switcher if needed, usually hidden, or just use browser lang for setup */}
      </>
    );
  }

  const unreadCount = inbox.filter(i => !i.isRead).length;

  return (
    <div className="h-screen flex text-slate-800 dark:text-slate-200 overflow-hidden">
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}>
         <div className="h-full px-3 py-4 overflow-y-auto bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center pl-2.5 mb-5">
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-800 dark:text-slate-200">NUL flow</span>
                </div>
                {/* User Info Snippet */}
                <div className="px-3 mb-6">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{userProfile.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 truncate">{userProfile.email}</div>
                </div>

                <ul className="space-y-2">
                    <NavItem icon={<HomeIcon />} label={t('nav.home')} pageName="home" />
                    <NavItem icon={<InboxIcon />} label={t('nav.inbox')} pageName="inbox" badgeCount={unreadCount} />
                    <NavItem icon={<ClockIcon />} label={t('nav.history')} pageName="history" />
                    <NavItem icon={<UsersIcon />} label={t('nav.contacts')} pageName="contacts" />
                    <NavItem icon={<DocumentArrowDownIcon />} label={t('nav.dataExport')} pageName="data-export" />
                </ul>
                <div className="absolute bottom-4 left-3 right-3 space-y-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="w-full text-left p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/50">
                            {LANGUAGES[locale]}
                        </button>
                        {isLangDropdownOpen && (
                            <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg border dark:border-slate-600">
                                {Object.entries(LANGUAGES).map(([key, name]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setLocale(key as keyof typeof LANGUAGES); setLangDropdownOpen(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                                    >{name}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    <ExtraNavItem icon={<InstallIcon />} label={t('nav.installApp')} onClick={handleInstallClick} visible={!!installPromptEvent} />
                    <ExtraNavItem icon={<ShareAppIcon />} label={t('nav.shareApp')} onClick={handleShareClick} visible={canShare} />
                    <NavItem icon={<Cog6ToothIcon />} label={t('nav.settings')} pageName="settings" />
                </div>
           </div>
      </aside>
      
      <div className="flex-1 flex flex-col w-full">
        <header className="fixed top-0 left-0 right-0 z-30 lg:hidden">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">NUL flow</span>
                </div>
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
                    {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 relative">
          <div className="p-4 sm:p-6 lg:p-8 h-full relative z-10">
            {renderPage()}
          </div>
        </main>
      </div>
      
      {isSendingFlow && <NulFlowWizard onClose={handleCloseFlow} onSave={handleSaveFlow} contacts={contacts} />}
      {showCrisisModal && <CrisisModal />}
      {contactToDelete && <ConfirmDeleteModal />}
      {showOnboarding && <WelcomeOverlay onClose={handleCloseOnboarding} />}
    </div>
  );
};

export default App;