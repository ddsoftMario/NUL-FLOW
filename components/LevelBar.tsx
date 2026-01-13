
import React from 'react';

interface LevelBarProps {
  value: number;
  colorClass: string;
  label: string;
}

const LevelBar: React.FC<LevelBarProps> = ({ value, colorClass, label }) => (
  <div className="flex-1">
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-bold text-slate-800 dark:text-slate-200">{value}%</span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default LevelBar;
