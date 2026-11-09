import React from 'react';
import { DecisionStatus } from '../types/decision';

interface StatusBadgeProps {
  status: DecisionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<DecisionStatus, { text: string; dot: string; label: string }> = {
    Draft: {
      text: 'text-stone-600',
      dot: 'bg-stone-400',
      label: 'Draft',
    },
    'In discussion': {
      text: 'text-indigo-700 font-medium',
      dot: 'bg-indigo-500',
      label: 'In discussion',
    },
    'Needs input': {
      text: 'text-amber-700 font-medium',
      dot: 'bg-amber-500',
      label: 'Needs input',
    },
    'Ready to decide': {
      text: 'text-purple-700 font-medium',
      dot: 'bg-purple-500',
      label: 'Ready to decide',
    },
    Decided: {
      text: 'text-emerald-700 font-medium',
      dot: 'bg-emerald-600',
      label: 'Decided',
    },
    Archived: {
      text: 'text-stone-500',
      dot: 'bg-stone-300',
      label: 'Archived',
    },
  };

  const current = styles[status] || styles['Draft'];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${current.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
};
