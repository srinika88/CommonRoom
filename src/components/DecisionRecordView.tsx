import React from 'react';
import { CheckCircle2, History, AlertTriangle, ArrowLeft } from 'lucide-react';
import { DecisionRoom, TeamMember } from '../types/decision';

interface DecisionRecordViewProps {
  room: DecisionRoom;
  teamMembers: TeamMember[];
  onBackToCanvas: () => void;
}

export const DecisionRecordView: React.FC<DecisionRecordViewProps> = ({
  room,
  teamMembers,
  onBackToCanvas,
}) => {
  const record = room.finalRecord;
  if (!record) {
    return (
      <div className="p-12 text-center text-stone-500 text-xs">
        This decision room has not been finalized yet.
      </div>
    );
  }

  const finalizedBy =
    teamMembers.find((m) => m.id === record.finalizedById) || teamMembers[0];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              Immutable Decision Record
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">{room.title}</h2>
          <p className="text-xs text-stone-500 font-mono">
            Finalized on {new Date(record.finalizedAt).toLocaleDateString()} by{' '}
            <strong className="text-stone-800 font-semibold">{finalizedBy.name}</strong> ({finalizedBy.role})
          </p>
        </div>

        <button
          onClick={onBackToCanvas}
          className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-800 text-xs font-medium hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inspect Canvas</span>
        </button>
      </div>

      {/* Chosen Alternative Highlight */}
      <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-2.5 shadow-xs">
        <span className="text-[11px] font-mono font-semibold uppercase text-stone-400">
          Selected Pathway
        </span>
        <h3 className="text-lg font-bold text-stone-900 text-indigo-700">
          {record.chosenAltName}
        </h3>
        <div className="mt-2 text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
          <strong className="block font-semibold text-stone-900 mb-1">
            Executive Rationale:
          </strong>
          {record.rationale}
        </div>
      </div>

      {/* Rejected Alternatives & Preserved Objections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase text-stone-400">
            Alternatives Rejected & Why
          </span>
          <div className="space-y-2 text-xs">
            {record.rejectedAlternativesSummary &&
            record.rejectedAlternativesSummary.length > 0 ? (
              record.rejectedAlternativesSummary.map((r, i) => (
                <div
                  key={i}
                  className="p-3 bg-stone-50 rounded-lg border border-stone-100"
                >
                  <div className="font-semibold text-stone-800">{r.name}</div>
                  <div className="text-stone-500 text-[11px] mt-0.5">
                    {r.reason}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-stone-400 italic text-[11px]">
                No competing options were rejected.
              </div>
            )}
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase text-stone-400">
            Preserved Objections & Known Risks
          </span>
          <div className="space-y-2 text-xs">
            {record.preservedObjections &&
            record.preservedObjections.length > 0 ? (
              record.preservedObjections.map((objText, i) => (
                <div
                  key={i}
                  className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-snug flex items-start gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{objText}</span>
                </div>
              ))
            ) : (
              <div className="text-stone-400 italic text-[11px]">
                Zero dissenting objections preserved.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
