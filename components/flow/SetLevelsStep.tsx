
import React, { useRef, useCallback } from 'react';
import type { NulFlowEntry } from '../../types';
import { ArrowRightIcon } from '../icons';
import { useTranslation } from '../../i18n';

interface DraggableLevelProps {
  level: number;
  setLevel: (level: number) => void;
  type: 'bucket' | 'battery';
}

const DraggableLevel: React.FC<DraggableLevelProps> = ({ level, setLevel, type }) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const isBucket = type === 'bucket';
    
    const levelCategoryKey = isBucket
        ? (level > 70 ? 'high' : level > 40 ? 'moderate' : 'low')
        : (level < 30 ? 'critical' : level < 60 ? 'low' : 'good');
    
    const levelCategory = t(`wizard.setLevels.levels.${levelCategoryKey}`);

    const colorStyles = isBucket
        ? {
            'low': { bg: 'bg-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]', icon: 'text-blue-600 dark:text-blue-400' },
            'moderate': { bg: 'bg-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]', icon: 'text-yellow-600 dark:text-yellow-400' },
            'high': { bg: 'bg-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]', icon: 'text-red-600 dark:text-red-400' },
        }[levelCategoryKey]
        : {
            'critical': { bg: 'bg-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]', icon: 'text-red-600 dark:text-red-400' },
            'low': { bg: 'bg-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]', icon: 'text-yellow-600 dark:text-yellow-400' },
            'good': { bg: 'bg-green-500', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]', icon: 'text-green-600 dark:text-green-400' },
        }[levelCategoryKey];

    const handleInteraction = useCallback((clientY: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const newLevel = 100 - ((clientY - rect.top) / rect.height) * 100;
            setLevel(Math.max(0, Math.min(100, Math.round(newLevel))));
        }
    }, [setLevel]);

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseLeave = () => { isDragging.current = false; };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging.current) handleInteraction(e.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        handleInteraction(e.touches[0].clientY);
    };

    // Calculate text color contrast:
    // If level > 55, text sits on the filled color -> White
    // If level <= 55, text sits on the background -> Dark (Light mode) / White (Dark mode)
    const textColor = level > 55 ? 'text-white' : 'text-slate-800 dark:text-white';

    return (
        <div className="flex flex-col items-center">
            <div
                ref={containerRef}
                className="relative w-28 h-40 bg-gray-100 dark:bg-slate-700 rounded-3xl border-4 border-white dark:border-slate-600 shadow-inner cursor-pointer"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={(e) => handleInteraction(e.touches[0].clientY)}
                onTouchMove={handleTouchMove}
                onClick={(e) => handleInteraction(e.clientY)}
            >
                <div className={`absolute bottom-0 w-full rounded-2xl transition-colors duration-200 ${colorStyles.bg} ${colorStyles.glow}`} style={{ height: `${level}%` }} />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gray-300 dark:bg-slate-500 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-3xl font-bold ${textColor} drop-shadow-sm transition-colors duration-200`}>{level}%</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className={`text-xl font-bold ${colorStyles.icon}`}>{isBucket ? t('wizard.setLevels.socialLoad') : t('wizard.setLevels.energy')}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{levelCategory}</p>
            </div>
        </div>
    );
};

interface SetLevelsStepProps {
  data: Pick<NulFlowEntry, 'bucketLevel' | 'batteryLevel'>;
  onUpdate: (updates: Partial<NulFlowEntry>) => void;
  onNext: () => void;
}

const SetLevelsStep: React.FC<SetLevelsStepProps> = ({ data, onUpdate, onNext }) => {
  const { t } = useTranslation();
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('wizard.setLevels.title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">{t('wizard.setLevels.description')}</p>
      
      <div className="flex justify-around items-start p-4 bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 mb-8">
        <DraggableLevel level={data.bucketLevel} setLevel={(l) => onUpdate({ bucketLevel: l })} type="bucket" />
        <DraggableLevel level={data.batteryLevel} setLevel={(l) => onUpdate({ batteryLevel: l })} type="battery" />
      </div>

      <button
        onClick={onNext}
        className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
      >
        {t('wizard.buttons.next')}
        <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default SetLevelsStep;
