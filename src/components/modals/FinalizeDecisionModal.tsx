import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { DecisionRoom, TeamMember } from '../../types/decision';

interface FinalizeDecisionModalProps {
  room: DecisionRoom;
  teamMembers: TeamMember[];
  onClose: () => void;
  onFinalize: (payload: {
    chosenAltId: string;
    rationale: string;
    rejectedSummary: Array<{ name: string; reason: string }>;
  }) => void;
}

export const FinalizeDecisionModal: React.FC<FinalizeDecisionModalProps> = ({
  room,
  teamMembers,
  onClose,
  onFinalize,
}) => {
  const [chosenAltId, setChosenAltId] = useState(
    room.alternatives[0]?.id || ''
  );
  const [rationale, setRationale] = useState('');

  const unresolvedObjections =
    room.objections?.filter(
      (o) => o.status === 'Open' || o.status === 'Under discussion'
    ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rationale.trim() || !chosenAltId) return;

    const rejectedAlts = room.alternatives.filter((a) => a.id !== chosenAltId);
    const rejectedSummary = rejectedAlts.map((a) => ({
      name: a.name,
      reason:
        'Weighed during deliberation; trade-offs considered less favorable than the chosen pathway.',
    }));

    onFinalize({
      chosenAltId,
      rationale: rationale.trim(),
      rejectedSummary,
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-stone-900 text-base">
              Finalize Decision & Generate Memory Record
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {unresolvedObjections.length > 0 && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Notice: {unresolvedObjections.length} Unresolved Objection(s) Will
                Be Preserved
              </span>
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Commonroom does not hide dissenting opinions upon finalization.
              These objections will be permanently recorded in the Decision
              Memory archive as known risks.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-800 mb-2">
              Select Chosen Alternative
            </label>
            <div className="space-y-2">
              {room.alternatives?.map((alt) => (
                <label
                  key={alt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    chosenAltId === alt.id
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="chosenAlt"
                    checked={chosenAltId === alt.id}
                    onChange={() => setChosenAltId(alt.id)}
                    className="mt-0.5 accent-emerald-600 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-stone-900">{alt.name}</div>
                    <div className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                      {alt.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Final Decision Rationale (Required)
            </label>
            <textarea
              rows={4}
              required
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Explain why this option won over the competing alternatives, how objections were weighed, and what evidence was decisive..."
              className="w-full p-3 border border-stone-200 rounded-lg outline-none focus:border-emerald-600 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-mono">
              Will commit this room to immutable Decision Memory.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-xs transition-colors"
              >
                Sign Off & Commit Record
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
