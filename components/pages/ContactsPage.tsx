
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Contact } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '../icons';
import { useTranslation } from '../../i18n';
import EditContactModal from '../EditContactModal';

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const PermissionToggle: React.FC<ToggleProps> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-600 dark:text-slate-300">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-slate-800 ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);


const ContactCard: React.FC<{ contact: Contact; onUpdate: (updatedContact: Contact) => void; onDelete: (contactId: string) => void; onEdit: () => void; }> = ({ contact, onUpdate, onDelete, onEdit }) => {
    const { t } = useTranslation();
    const handlePermissionChange = (permission: keyof Contact['permissions'], value: boolean) => {
        onUpdate({
            ...contact,
            permissions: {
                ...contact.permissions,
                [permission]: value,
            }
        });
    };
    
    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 dark:border-slate-700/50 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-xl">
                        {contact.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-slate-200">{contact.name}</p>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">{contact.group}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(contact.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-slate-400 mt-4">
                {contact.email && <p>✉️ {contact.email}</p>}
                {contact.phone && <p>📞 {contact.phone}</p>}
            </div>

            <hr className="my-4 dark:border-slate-700" />

            <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2 text-sm">{t('contacts.sharingPermissions')}</h4>
                <PermissionToggle label={t('contacts.canRequestState')} enabled={contact.permissions.canRequestState} onChange={val => handlePermissionChange('canRequestState', val)} />
                <PermissionToggle label={t('contacts.canSeeBucket')} enabled={contact.permissions.canSeeBucketLevel} onChange={val => handlePermissionChange('canSeeBucketLevel', val)} />
                <PermissionToggle label={t('contacts.canSeeBattery')} enabled={contact.permissions.canSeeBatteryLevel} onChange={val => handlePermissionChange('canSeeBatteryLevel', val)} />
                <PermissionToggle label={t('contacts.canSeeNotes')} enabled={contact.permissions.canSeePrivateNotes} onChange={val => handlePermissionChange('canSeePrivateNotes', val)} />
            </div>
        </div>
    );
};


const ContactsPage: React.FC<{ 
    contacts: Contact[]; 
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
    contactGroups: string[];
    onCreateGroup: (groupName: string) => void;
    onConfirmDelete: (contactId: string) => void;
}> = ({ contacts, setContacts, contactGroups, onCreateGroup, onConfirmDelete }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const newGroupInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isCreatingGroup) {
            newGroupInputRef.current?.focus();
        }
    }, [isCreatingGroup]);

    const handleUpdateContact = (updatedContact: Contact) => {
        setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
        setIsEditModalOpen(false);
        setEditingContact(null);
    };

    const handleDeleteContact = (contactId: string) => {
        onConfirmDelete(contactId);
    };
    
    const handleEditClick = (contact: Contact) => {
        setEditingContact(contact);
        setIsEditModalOpen(true);
    };

    const handleQuickAdd = () => {
        const newContact: Contact = {
            id: `contact_${Date.now()}`,
            name: t('contacts.newContactName'),
            group: contactGroups[0] || 'Uncategorized',
            permissions: {
                canRequestState: false,
                canSeeBucketLevel: false,
                canSeeBatteryLevel: false,
                canSeePrivateNotes: false,
            }
        };
        setContacts(prev => [newContact, ...prev]);
        handleEditClick(newContact);
    };

    const handleCreateNewGroup = () => {
        const trimmedName = newGroupName.trim();
        if (trimmedName) {
            if (contactGroups.map(g => g.toLowerCase()).includes(trimmedName.toLowerCase())) {
                alert(t('contacts.groupNameExists'));
            } else {
                onCreateGroup(trimmedName);
                setIsCreatingGroup(false);
                setNewGroupName('');
            }
        }
    };

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const nameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
            const groupMatch = filterGroup === 'All' || contact.group === filterGroup;
            return nameMatch && groupMatch;
        });
    }, [contacts, searchTerm, filterGroup]);

    const allFilterGroups = ['All', ...contactGroups];

    return (
        <>
            <div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('contacts.title')}</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{t('contacts.description')}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-center">
                        <div className="relative lg:col-span-1">
                             <input 
                                type="text"
                                placeholder={t('contacts.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm dark:text-white dark:placeholder-slate-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                             />
                             <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex gap-4">
                           {isCreatingGroup ? (
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        ref={newGroupInputRef}
                                        type="text"
                                        placeholder={t('contacts.enterGroupName')}
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateNewGroup()}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                    />
                                    <button onClick={handleCreateNewGroup} className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">✓</button>
                                    <button onClick={() => setIsCreatingGroup(false)} className="p-3 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">×</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsCreatingGroup(true)} className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 font-semibold rounded-full hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors">
                                    {t('contacts.newGroup')}
                                </button>
                            )}

                         <button onClick={handleQuickAdd} className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
                            <PlusIcon className="w-5 h-5"/>
                            {t('contacts.quickAdd')}
                        </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {allFilterGroups.map(group => (
                            <button
                                key={group}
                                onClick={() => setFilterGroup(group)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-purple-500 ${
                                    filterGroup === group
                                        ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                                        : 'bg-white/80 dark:bg-slate-700/80 text-gray-600 dark:text-slate-300 hover:bg-gray-200/80 dark:hover:bg-slate-600/80 border border-gray-200 dark:border-slate-600 hover:scale-105'
                                }`}
                            >
                                {group === 'All' ? t('contacts.all') : t(`contactGroups.${group}`, { defaultValue: group })}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {t('contacts.showingContacts', { count: filteredContacts.length, total: contacts.length })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map(contact => (
                            <ContactCard 
                                key={contact.id} 
                                contact={contact} 
                                onUpdate={handleUpdateContact} 
                                onDelete={handleDeleteContact}
                                onEdit={() => handleEditClick(contact)}
                            />
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-500 dark:text-slate-400">
                            <p>{t('contacts.noContactsFound')}</p>
                        </div>
                    )}
                </div>
            </div>
            {isEditModalOpen && editingContact && (
                <EditContactModal 
                    contact={editingContact}
                    onSave={handleUpdateContact}
                    onClose={() => setIsEditModalOpen(false)}
                    groups={contactGroups}
                />
            )}
        </>
    );
};

export default ContactsPage;
