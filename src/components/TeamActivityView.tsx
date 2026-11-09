import React from 'react';
import { DecisionRoom, TeamMember } from '../types/decision';

interface TeamActivityViewProps {
  decisions: DecisionRoom[];
  teamMembers: TeamMember[];
  onOpenRoom: (roomId: string) => void;
}

export const TeamActivityView: React.FC<TeamActivityViewProps> = ({
  decisions,
  teamMembers,
  onOpenRoom,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Team Deliberation Stream
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Live audit trail of competing options, challenged assumptions, and
          decisions finalized across the organization.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 divide-y divide-stone-100 shadow-xs">
        <div className="py-3.5 flex items-start gap-3 text-xs">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            AM
          </div>
          <div className="flex-1">
            <span className="font-semibold text-stone-900">Alex Morgan</span>{' '}
            raised high-importance objection in{' '}
            <strong
              onClick={() => onOpenRoom('dec-1')}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              "Should we launch a free plan?"
            </strong>
            <p className="text-stone-600 text-[11px] mt-1 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
              "Uncapped infrastructure and LLM compute liability: If we allow
              unlimited canvas state on a perpetual free plan, our margins turn
              negative before Series A."
            </p>
            <span className="text-[10px] text-stone-400 font-mono block mt-1">
              18m ago
            </span>
          </div>
        </div>

        <div className="py-3.5 flex items-start gap-3 text-xs">
          <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            MP
          </div>
          <div className="flex-1">
            <span className="font-semibold text-stone-900">Maya Patel</span> added
            empirical customer interview evidence from Gong:{' '}
            <em className="text-stone-700">15 Customer Success Exit Interviews</em>.
            <span className="text-[10px] text-stone-400 font-mono block mt-1">
              2h ago
            </span>
          </div>
        </div>

        <div className="py-3.5 flex items-start gap-3 text-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            SC
          </div>
          <div className="flex-1">
            <span className="font-semibold text-stone-900">Sarah Chen</span>{' '}
            proposed new hybrid alternative:{' '}
            <em className="text-stone-700">
              Interactive 30-Day Project Sandbox
            </em>{' '}
            to cap liability without adding trial credit-card friction.
            <span className="text-[10px] text-stone-400 font-mono block mt-1">
              Yesterday
            </span>
          </div>
        </div>

        <div className="py-3.5 flex items-start gap-3 text-xs">
          <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            DK
          </div>
          <div className="flex-1">
            <span className="font-semibold text-stone-900">Daniel Kim</span>{' '}
            finalized decision record for{' '}
            <strong
              onClick={() => onOpenRoom('dec-4')}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              "Desktop Power-User Focus in Q4"
            </strong>
            .
            <span className="text-[10px] text-stone-400 font-mono block mt-1">
              Oct 14
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
