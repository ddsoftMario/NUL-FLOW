
import React, { useState, useEffect, useCallback } from 'react';
import { HomeIcon, InboxIcon, ClockIcon, UsersIcon, Cog6ToothIcon, XMarkIcon, Bars3Icon, DocumentArrowDownIcon, ShareAppIcon, InstallIcon } from './components/icons';
import type { Page, NulFlowEntry, Contact, Theme, UserProfile } from './types';
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
import InstallPwaBanner from './components/InstallPwaBanner';
import InboxItemModal from './components/InboxItemModal';
import { checkCrisisPattern } from './services/geminiService';
import { useTranslation, LANGUAGES } from './i18n';

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

export interface InboxItem extends NulFlowEntry {
  senderId: string;
  isRead: boolean;
}

export interface NotificationSettings {
    bucketOverflow: boolean;
    lowBattery: boolean;
    dailyCheckin: boolean;
    weeklyReports: boolean;
}

const App: React.FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSendingFlow, setIsSendingFlow] = useState(false);
  
  // User Profile State - Loaded from LocalStorage
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
    } catch (error) { console.error("Failed to load history", error); }
    return [];
  });
  
  const [contacts, setContacts] = useState<Contact[]>(() => {
      try {
          const savedContacts = localStorage.getItem('nul-flow-contacts');
          return savedContacts ? JSON.parse(savedContacts) : [];
      } catch (error) { console.error("Failed to load contacts", error); }
      return [];
  });

  const [inbox, setInbox] = useState<InboxItem[]>(() => {
      try {
        const savedInbox = localStorage.getItem('nul-flow-inbox');
        if (savedInbox) {
            return JSON.parse(savedInbox).map((item: any) => ({
                ...item,
                timestamp: new Date(item.timestamp),
            }));
        }
      } catch(e) { console.error("Failed to load inbox", e); }
      return [];
  });
  const [selectedInboxItem, setSelectedInboxItem] = useState<InboxItem | null>(null);

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    try {
        const saved = localStorage.getItem('nul-flow-notifications');
        return saved ? JSON.parse(saved) : {
            bucketOverflow: true,
            lowBattery: true,
            dailyCheckin: true, 
            weeklyReports: true,
        };
    } catch (e) {
        return { bucketOverflow: true, lowBattery: true, dailyCheckin: true, weeklyReports: true };
    }
  });

  const [crisisAlert, setCrisisAlert] = useState<boolean>(false);
  const [showCrisisModal, setShowCrisisModal] = useState<boolean>(false);
  const [showDailyCheckinModal, setShowDailyCheckinModal] = useState<boolean>(false);
  const [checkinNote, setCheckinNote] = useState('');
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [isConfirmingReset, setConfirmingReset] = useState(false);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallDismissed, setIsInstallDismissed] = useState(() => {
    return localStorage.getItem('nul-flow-install-dismissed') === 'true';
  });
  
  const [canShare, setCanShare] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Welcome message for new users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeMessage');
    if (userProfile && !hasSeenWelcome) {
      const welcomeMsg: InboxItem = {
        id: 'welcome_msg_01',
        timestamp: new Date(),
        bucketLevel: 20,
        batteryLevel: 90,
        moods: ['energized', 'focused'],
        senderId: 'nul_flow_team', 
        isRead: false,
        notes: t('inbox.welcomeMessage')
      };
      setInbox([welcomeMsg]);
      localStorage.setItem('hasSeenWelcomeMessage', 'true');
    }
  }, [userProfile, t]);

  // Daily Check-in Logic
  useEffect(() => {
    if (userProfile && notifications.dailyCheckin) {
        const lastCheckin = localStorage.getItem('lastDailyCheckin');
        const today = new Date().toDateString();
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        
        if (lastCheckin !== today && hasSeenOnboarding === 'true' && !showOnboarding) {
            const timer = setTimeout(() => {
                setShowDailyCheckinModal(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }
  }, [userProfile, notifications.dailyCheckin, showOnboarding]);

  // Persistence Effects
  useEffect(() => {
    try { localStorage.setItem('nul-flow-history', JSON.stringify(history)); } catch (e) {}
  }, [history]);

  useEffect(() => {
    try { localStorage.setItem('nul-flow-contacts', JSON.stringify(contacts)); } catch (e) {}
  }, [contacts]);
  
  useEffect(() => {
    try { localStorage.setItem('nul-flow-inbox', JSON.stringify(inbox)); } catch (e) {}
  }, [inbox]);
  
  useEffect(() => {
    localStorage.setItem('nul-flow-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nul-flow-theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
    
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

  const handleResetAppData = () => {
    setHistory([]);
    setContacts([]);
    setInbox([]);
    setUserProfile(null);
    localStorage.removeItem('nul-flow-user');
    localStorage.removeItem('hasSeenOnboarding');
    localStorage.removeItem('hasSeenWelcomeMessage');
    localStorage.removeItem('lastDailyCheckin');
    setConfirmingReset(false);
  };

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then(() => {
        setInstallPromptEvent(null);
        handleDismissInstallBanner();
      });
    }
  };

  const handleDismissInstallBanner = () => {
    localStorage.setItem('nul-flow-install-dismissed', 'true');
    setIsInstallDismissed(true);
  };
  
  const handleShareClick = () => {
    if (navigator.share) {
        const url = window.location.href;
        const shareData = {
            title: 'NUL flow',
            text: t('share.text', { url }),
            url: url,
        };
        navigator.share(shareData).catch(console.error);
    }
  };

  const handleSelectInboxItem = (itemId: string) => {
    const item = inbox.find(i => i.id === itemId);
    if (item) {
        setSelectedInboxItem(item);
    }
  };

  const handleCloseInboxItem = () => {
    if (selectedInboxItem) {
        setInbox(prev =>
            prev.map(item =>
                item.id === selectedInboxItem.id ? { ...item, isRead: true } : item
            )
        );
        setSelectedInboxItem(null);
    }
  };

  const contactGroups = [...new Set(contacts.map(c => c.group))].sort();

  const handleStartFlow = () => {
    setIsSendingFlow(true);
  };
  
  const handleSaveDailyCheckin = () => {
      const newEntry: NulFlowEntry = {
        id: `checkin_${Date.now()}`,
        timestamp: new Date(),
        bucketLevel: 50,
        batteryLevel: 50,
        moods: ['daily-log'],
        notes: checkinNote,
        sharedWith: []
      };
      
      setHistory(prev => [newEntry, ...prev]);
      setShowDailyCheckinModal(false);
      setCheckinNote('');
      localStorage.setItem('lastDailyCheckin', new Date().toDateString());
  };

  const handleDismissDailyCheckin = () => {
      setShowDailyCheckinModal(false);
      setCheckinNote('');
      localStorage.setItem('lastDailyCheckin', new Date().toDateString());
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

  const handleProfileComplete = (profile: UserProfile, initialContacts: Contact[]) => {
    setUserProfile(profile);
    localStorage.setItem('nul-flow-user', JSON.stringify(profile));
    
    if (initialContacts && initialContacts.length > 0) {
      setContacts(initialContacts);
    }
    
    setTimeout(() => {
        setShowOnboarding(true);
    }, 500);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('nul-flow-user', JSON.stringify(updatedProfile));
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
        console.error("Error checking crisis pattern", error);
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
    if (!userProfile) return null;
    switch (page) {
      case 'home':
        return <HomePage onStartFlow={handleStartFlow} onRequestFlow={handleRequestFlow} contacts={contacts} onNavigate={setPage} />;
      case 'inbox':
        return <InboxPage inboxItems={inbox} contacts={contacts} onSelectItem={handleSelectInboxItem} />;
      case 'history':
        return <HistoryPage history={history} onNavigate={setPage} />;
      case 'contacts':
        return <ContactsPage contacts={contacts} setContacts={setContacts} contactGroups={contactGroups} onCreateGroup={() => {}} onConfirmDelete={setContactToDelete} />;
      case 'settings':
        return <SettingsPage 
                    theme={theme} 
                    setTheme={setTheme} 
                    userProfile={userProfile} 
                    onUpdateProfile={handleUpdateProfile} 
                    onResetData={() => setConfirmingReset(true)}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    canInstall={!!installPromptEvent}
                    onInstall={handleInstallClick}
                    onBack={() => setPage('home')}
                />;
      case 'data-export':
        return <DataExportPage history={history} />;
      case 'request-flow':
        return <RequestFlowPage contacts={contacts} onBack={() => setPage('home')} />;
      default:
        return <HomePage onStartFlow={handleStartFlow} onRequestFlow={handleRequestFlow} contacts={contacts} onNavigate={setPage} />;
    }
  };

  if (!userProfile) {
    return (
      <ProfileSetup onComplete={handleProfileComplete} />
    );
  }

  const unreadCount = inbox.filter(i => !i.isRead).length;
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className="h-screen flex text-slate-800 dark:text-slate-200 overflow-hidden relative">
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}>
         <div className="h-full px-3 py-4 overflow-y-auto bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center pl-2.5 mb-5">
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-800 dark:text-slate-200">NUL flow</span>
                </div>
                {userProfile && (
                  <div className="px-3 py-2 mb-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{userProfile.screenName || userProfile.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">{t('nav.profile')}</div>
                  </div>
                )}

                <ul className="space-y-2">
                    <NavItem icon={<HomeIcon />} label={t('nav.home')} pageName="home" active={page === 'home'} onClick={() => {setPage('home'); setSidebarOpen(false)}} />
                    <NavItem icon={<InboxIcon />} label={t('nav.inbox')} pageName="inbox" active={page === 'inbox'} badgeCount={unreadCount} onClick={() => {setPage('inbox'); setSidebarOpen(false)}} />
                    <NavItem icon={<ClockIcon />} label={t('nav.history')} pageName="history" active={page === 'history'} onClick={() => {setPage('history'); setSidebarOpen(false)}} />
                    <NavItem icon={<UsersIcon />} label={t('nav.contacts')} pageName="contacts" active={page === 'contacts'} onClick={() => {setPage('contacts'); setSidebarOpen(false)}} />
                    <NavItem icon={<DocumentArrowDownIcon />} label={t('nav.dataExport')} pageName="data-export" active={page === 'data-export'} onClick={() => {setPage('data-export'); setSidebarOpen(false)}} />
                </ul>
                <div className="absolute bottom-4 left-3 right-3 space-y-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="w-full text-left p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/50">
                            {LANGUAGES[locale]}
                        </button>
                        {isLangDropdownOpen && (
                            <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg border dark:border-slate-600 z-50">
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
                    
                    <ExtraNavItem icon={<InstallIcon />} label={t('nav.installApp')} onClick={handleInstallClick} visible={!!installPromptEvent && !isInStandaloneMode} />
                    <ExtraNavItem icon={<ShareAppIcon />} label={t('nav.shareApp')} onClick={handleShareClick} visible={canShare} />
                    <NavItem icon={<Cog6ToothIcon />} label={t('nav.settings')} pageName="settings" active={page === 'settings'} onClick={() => {setPage('settings'); setSidebarOpen(false)}} />
                </div>
           </div>
      </aside>
      
      <div className="flex-1 flex flex-col w-full min-h-0">
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

        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 relative mb-8">
          <div className="p-4 sm:p-6 lg:p-8 h-full relative z-10 pb-16">
            {renderPage()}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 py-2 text-center pointer-events-none z-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 opacity-40">
            Neuro Universal Language by 1013th — built for the Neurodivergent brain
          </p>
        </footer>
      </div>
      
      {isSendingFlow && <NulFlowWizard onClose={handleCloseFlow} onSave={handleSaveFlow} contacts={contacts} onNavigate={setPage} />}
      {showCrisisModal && <CrisisModal onClose={() => setShowCrisisModal(false)} />}
      {showDailyCheckinModal && <DailyCheckinModal 
        checkinNote={checkinNote} 
        setCheckinNote={setCheckinNote} 
        onSave={handleSaveDailyCheckin} 
        onDismiss={handleDismissDailyCheckin} 
      />}
      {contactToDelete && <ConfirmDeleteModal onCancel={() => setContactToDelete(null)} onConfirm={handleExecuteDelete} />}
      {isConfirmingReset && <ConfirmResetModal onCancel={() => setConfirmingReset(false)} onConfirm={handleResetAppData} />}
      {showOnboarding && <WelcomeOverlay onClose={handleCloseOnboarding} />}
      {selectedInboxItem && (
        <InboxItemModal
            item={selectedInboxItem}
            sender={contacts.find(c => c.id === selectedInboxItem.senderId)}
            onClose={handleCloseInboxItem}
        />
      )}
      {!isInstallDismissed && !isInStandaloneMode && (
        <InstallPwaBanner 
            canInstall={!!installPromptEvent}
            onInstall={handleInstallClick}
            onDismiss={handleDismissInstallBanner}
        />
      )}
    </div>
  );
};

// Component helpers moved outside for cleaner App body
const NavItem: React.FC<{ icon: React.ReactNode; label: string; pageName: Page; active: boolean; badgeCount?: number; onClick: () => void }> = ({ icon, label, pageName, active, badgeCount, onClick }) => (
    <li>
      <button 
        onClick={onClick}
        className={`flex items-center p-3 w-full text-base font-normal rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-purple-500 ${
          active 
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
            <span className="ml-3 flex-1 whitespace-nowrap text-left">{label}</span>
        </button>
    );
};

const CrisisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
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
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {t('crisisModal.notifyButton')}
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('crisisModal.dismissButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

const DailyCheckinModal: React.FC<{ checkinNote: string, setCheckinNote: (v: string) => void, onSave: () => void, onDismiss: () => void }> = ({ checkinNote, setCheckinNote, onSave, onDismiss }) => {
    const { t } = useTranslation();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[150] p-4 backdrop-blur-sm animate-fade-in-slow">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 w-full max-w-md text-center shadow-2xl relative">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 mb-4">
                  <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('dailyCheckin.title')}</h3>
              
              <div className="mt-6 text-left">
                  <label htmlFor="dailyCheckinText" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                    {t('dailyCheckin.message')}
                  </label>
                  <textarea
                    id="dailyCheckinText"
                    rows={6}
                    value={checkinNote}
                    onChange={(e) => setCheckinNote(e.target.value)}
                    placeholder={t('dailyCheckin.placeholder')}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/70 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none shadow-inner"
                  />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                  <button
                      onClick={onSave}
                      disabled={!checkinNote.trim()}
                      className="w-full inline-flex justify-center rounded-xl px-4 py-3 bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {t('dailyCheckin.save')}
                  </button>
                  <button
                      onClick={onDismiss}
                      className="w-full inline-flex justify-center rounded-xl px-4 py-3 bg-transparent text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                      {t('dailyCheckin.notNow')}
                  </button>
              </div>
          </div>
      </div>
    );
};

const ConfirmDeleteModal: React.FC<{ onCancel: () => void, onConfirm: () => void }> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[150] p-4 backdrop-blur-sm animate-fade-in-slow">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-w-sm text-center shadow-2xl shadow-red-500/20">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('contacts.confirmDeleteTitle')}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('contacts.confirmDeleteMessage')}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={onCancel} className="px-6 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all">
            {t('contacts.cancel')}
          </button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 border border-transparent rounded-full shadow-sm text-sm font-medium text-white hover:bg-red-700 transition-all">
            {t('contacts.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmResetModal: React.FC<{ onCancel: () => void, onConfirm: () => void }> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[150] p-4 backdrop-blur-sm animate-fade-in-slow">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-w-sm text-center shadow-2xl shadow-red-500/20">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('settings.resetConfirmTitle')}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('settings.resetConfirmMessage')}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={onCancel} className="px-6 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all">
            {t('contacts.cancel')}
          </button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 border border-transparent rounded-full shadow-sm text-sm font-medium text-white hover:bg-red-700 transition-all">
            {t('settings.resetButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
