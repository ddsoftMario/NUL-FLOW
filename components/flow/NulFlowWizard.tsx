
import React, { useState } from 'react';
import type { Contact, NulFlowEntry } from '../../types';
import SetLevelsStep from './SetLevelsStep';
import AddDetailsStep from './AddDetailsStep';
import ShareSaveStep from './ShareSaveStep';
import { useTranslation } from '../../i18n';

interface NulFlowWizardProps {
  onClose: () => void;
  onSave: (entry: Omit<NulFlowEntry, 'id' | 'timestamp'>) => void;
  contacts: Contact[];
}

const NulFlowWizard: React.FC<NulFlowWizardProps> = ({ onClose, onSave, contacts }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [flowData, setFlowData] = useState<Omit<NulFlowEntry, 'id' | 'timestamp'>>({
    bucketLevel: 50,
    batteryLevel: 75,
    moods: [],
    notes: '',
    sharedWith: [],
  });
  
  const updateData = (updates: Partial<typeof flowData>) => {
    setFlowData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const STEPS = [
    { number: 1, title: t('wizard.steps.setLevels') },
    { number: 2, title: t('wizard.steps.addDetails') },
    { number: 3, title: t('wizard.steps.shareSave') },
  ];
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl w-full max-w-md mx-auto flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          {/* Stepper */}
          <div className="flex items-center justify-between px-2 sm:px-4">
            {STEPS.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    step >= s.number ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                  }`}>
                    {step > s.number ? '✓' : s.number}
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${step >= s.number ? 'text-blue-600' : 'text-gray-500 dark:text-slate-400'}`}>{s.title}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 sm:mx-4 transition-colors duration-300 ${step > s.number ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-2">
            {step === 1 && <SetLevelsStep data={flowData} onUpdate={updateData} onNext={nextStep} />}
            {step === 2 && <AddDetailsStep data={flowData} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />}
            {step === 3 && <ShareSaveStep data={flowData} onUpdate={updateData} onSave={onSave} onBack={prevStep} contacts={contacts} />}
        </div>
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default NulFlowWizard;
