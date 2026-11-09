import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { DecisionRoom, ObjectionStatus, TeamMember } from '../types/decision';

interface DisagreementsTrackerViewProps {
  room: DecisionRoom;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onRaiseObjection: () => void;
  onUpdateStatus: (
    objId: string,
    newStatus: ObjectionStatus,
    resolutionNotes?: string
  ) => void;
}

export const DisagreementsTrackerView: React.FC<
  DisagreementsTrackerViewProps
> = ({ room, teamMembers, currentUser, onRaiseObjection, onUpdateStatus }) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [pendingStatus, setPendingStatus] = useState<ObjectionStatus>(
    'Accepted as a known risk'
  );

  const openCount =
    room.objections?.filter((o) => o.status === 'Open').length || 0;
  const acceptedRiskCount =
    room.objections?.filter((o) => o.status === 'Accepted as a known risk')
      .length || 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-stone-900">
              Unresolved Disagreements & Objections
            </h2>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              {openCount} Open
            </span>
            {acceptedRiskCount > 0 && (
              <span className="text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {acceptedRiskCount} Accepted Risks
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Commonroom preserves formal dissenting opinions so leadership never
            claims "we didn't know the risks."
          </p>
        </div>

        <button
          onClick={onRaiseObjection}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-xs transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Raise Formal Objection</span>
        </button>
      </div>

      {/* Objection Cards List */}
      <div className="space-y-4">
        {room.objections && room.objections.length > 0 ? (
          room.objections.map((obj) => {
            const raiser = teamMembers.find((m) => m.id === obj.raisedById);
            const assigned = teamMembers.find((m) => m.id === obj.assignedToId);
            const alt = room.alternatives?.find((a) => a.id === obj.altId);

            return (
              <div
                key={obj.id}
                className={`p-5 rounded-xl border bg-white shadow-xs space-y-3 transition-all ${
                  obj.status === 'Open'
                    ? 'border-rose-300'
                    : obj.status === 'Accepted as a known risk'
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        obj.status === 'Open'
                          ? 'bg-rose-100 text-rose-800'
                          : obj.status === 'Under discussion'
                          ? 'bg-blue-100 text-blue-800'
                          : obj.status === 'Accepted as a known risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {obj.status}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">
                      ·
                    </span>
                    <span className="text-stone-500 font-mono">
                      Importance: {obj.importance}
                    </span>
                  </div>

                  {/* Status update control */}
                  <div className="flex items-center gap-2">
                    <select
                      aria-label={`Update status for ${obj.title}`}
                      value={obj.status}
                      onChange={(e) => {
                        const targetStatus = e.target.value as ObjectionStatus;
                        if (
                          targetStatus === 'Addressed' ||
                          targetStatus === 'Accepted as a known risk'
                        ) {
                          setResolvingId(obj.id);
                          setPendingStatus(targetStatus);
                        } else {
                          onUpdateStatus(obj.id, targetStatus);
                        }
                      }}
                      className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 outline-none hover:border-stone-300 cursor-pointer"
                    >
                      <option value="Open">Status: Open</option>
                      <option value="Under discussion">
                        Status: Under discussion
                      </option>
                      <option value="Addressed">Status: Mark Addressed</option>
                      <option value="Accepted as a known risk">
                        Status: Accept as Known Risk
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900">{obj.title}</h3>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                    {obj.reason}
                  </p>
                </div>

                {alt && (
                  <div className="text-[11px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md inline-block">
                    Alternative impacted:{' '}
                    <strong className="text-stone-800 font-semibold">
                      {alt.name}
                    </strong>
                  </div>
                )}

                {/* Recorded Resolution or Risk Note */}
                {obj.resolutionNotes && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-stone-800 text-[10px] uppercase font-mono tracking-wider">
                      Recorded Resolution / Risk Mitigation:
                    </span>
                    <p className="text-stone-700 italic">
                      "{obj.resolutionNotes}"
                    </p>
                  </div>
                )}

                {/* Inline prompt for resolution notes */}
                {resolvingId === obj.id && (
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-2 text-xs">
                    <span className="font-semibold text-indigo-950">
                      Document why this objection is {pendingStatus.toLowerCase()}:
                    </span>
                    <textarea
                      rows={2}
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="e.g. Mitigated via 25 queries/mo limit on free workspaces and automatic inactivity archiving..."
                      className="w-full p-2 border border-indigo-200 rounded-md bg-white text-xs outline-none focus:border-indigo-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setResolvingId(null);
                          setResolutionText('');
                        }}
                        className="px-2.5 py-1 text-stone-500 hover:text-stone-800 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(
                            obj.id,
                            pendingStatus,
                            resolutionText.trim()
                          );
                          setResolvingId(null);
                          setResolutionText('');
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-[11px] font-medium hover:bg-indigo-700"
                      >
                        Save Status & Rationale
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>
                    Raised by:{' '}
                    <strong className="text-stone-700 font-medium">
                      {raiser?.name}
                    </strong>{' '}
                    ({raiser?.role})
                  </span>
                  <span>
                    Assigned to:{' '}
                    <strong className="text-stone-700 font-medium">
                      {assigned?.name || 'Unassigned'}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl bg-white">
            No formal objections currently open. The room is in preliminary alignment.
          </div>
        )}
      </div>
    </div>
  );
};
