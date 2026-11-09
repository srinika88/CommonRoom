import React from 'react';
import { DecisionRoom, TeamMember } from '../types/decision';
import { StatusBadge } from './StatusBadge';

interface MyContributionsViewProps {
  decisions: DecisionRoom[];
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  onOpenRoom: (roomId: string) => void;
}

export const MyContributionsView: React.FC<MyContributionsViewProps> = ({
  decisions,
  currentUser,
  teamMembers,
  onOpenRoom,
}) => {
  const myDecisions = decisions.filter((d) => d.ownerId === currentUser.id);
  const myObjections = decisions.flatMap((d) =>
    (d.objections || []).filter((o) => o.raisedById === currentUser.id)
  );
  const myEvidence = decisions.flatMap((d) =>
    (d.evidence || []).filter((e) => e.authorId === currentUser.id)
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-6">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${currentUser.color} text-white flex items-center justify-center font-bold text-sm`}
        >
          {currentUser.avatar}
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-900">
            {currentUser.name} — Contributions
          </h1>
          <p className="text-xs text-stone-500">
            {currentUser.role} · {currentUser.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
            {myDecisions.length}
          </div>
          <div className="text-xs text-stone-500 mt-1">Decisions Owned</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600">
            {myObjections.length}
          </div>
          <div className="text-xs text-stone-500 mt-1">Objections Raised</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
            {myEvidence.length}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Evidence Sources Attached
          </div>
        </div>
      </div>

      {/* Decisions Owned */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
          Decisions Facilitated By Me
        </h2>
        <div className="space-y-2">
          {myDecisions.length > 0 ? (
            myDecisions.map((d) => (
              <div
                key={d.id}
                onClick={() => onOpenRoom(d.id)}
                className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs hover:border-indigo-300 transition-colors cursor-pointer group shadow-xs"
              >
                <div>
                  <span className="font-semibold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {d.title}
                  </span>
                  <div className="text-[11px] text-stone-400 mt-0.5 font-mono">
                    {d.category} · Target: {d.deadline}
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-xl">
              You do not own any decisions yet. Start a new decision room to facilitate.
            </div>
          )}
        </div>
      </div>

      {/* Objections Raised by Me */}
      {myObjections.length > 0 && (
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            Formal Objections Raised by Me
          </h2>
          <div className="space-y-2">
            {myObjections.map((o) => (
              <div
                key={o.id}
                className="p-3.5 bg-white border border-stone-200 rounded-xl text-xs space-y-1 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">{o.title}</span>
                  <span className="font-mono text-[10px] text-stone-500">
                    Status: {o.status}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {o.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
