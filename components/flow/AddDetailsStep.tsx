
import React, { useState } from 'react';
import type { NulFlowEntry } from '../../types';
import { INITIAL_MOODS } from '../../constants';
import { ArrowRightIcon, ArrowLeftIcon, PlusIcon } from '../icons';
import { useTranslation } from '../../i18n';

interface AddDetailsStepProps {
  data: Pick<NulFlowEntry, 'moods' | 'notes'>;
  onUpdate: (updates: Partial<NulFlowEntry>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AddDetailsStep: React.FC<AddDetailsStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const { t } = useTranslation();
  const [customMood, setCustomMood] = useState('');
  const [availableMoods, setAvailableMoods] = useState(INITIAL_MOODS);

  const toggleMood = (mood: string) => {
    const newMoods = data.moods.includes(mood)
      ? data.moods.filter(m => m !== mood)
      : [...data.moods, mood];
    onUpdate({ moods: newMoods });
  };

  const handleAddCustomMood = () => {
    if (customMood && !availableMoods.includes(customMood) && !data.moods.includes(customMood)) {
      // In a real app, you might want to handle custom mood translations differently.
      // For this implementation, we'll just add the raw string.
      setAvailableMoods(prev => [...prev, customMood]);
      toggleMood(customMood);
      setCustomMood('');
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('wizard.addDetails.title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">{t('wizard.addDetails.description')}</p>

      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 text-left" style={{
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 1), rgba(250, 245, 255, 1))'
      }}>
          <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-3 text-center">{t('wizard.addDetails.feeling')}</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 text-center">{t('wizard.addDetails.selectMoods')}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
              {availableMoods.map(moodKey => (
                  <button
                    key={moodKey}
                    onClick={() => toggleMood(moodKey)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200 ${
                        data.moods.includes(moodKey) 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-slate-700'
                    }`}
                  >
                      {t(`moods.${moodKey}`, {})}
                  </button>
              ))}
          </div>

          <div className="flex gap-2 mb-6">
              <input 
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder={t('wizard.addDetails.addOwnMood')}
                className="flex-grow w-full px-4 py-2 border-2 border-purple-300 dark:border-purple-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button onClick={handleAddCustomMood} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <PlusIcon className="w-5 h-5"/>
              </button>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">{t('wizard.addDetails.additionalNotes')}</label>
            <textarea
                id="notes"
                rows={4}
                value={data.notes}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                placeholder={t('wizard.addDetails.notesPlaceholder')}
                className="w-full px-4 py-2 border-2 border-purple-300 dark:border-purple-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 transition-all duration-300">
          <ArrowLeftIcon className="w-5 h-5" />
          {t('wizard.buttons.back')}
        </button>
        <button onClick={onNext} className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300">
          {t('wizard.buttons.next')}
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AddDetailsStep;
