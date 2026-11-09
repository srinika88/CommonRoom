import React from 'react';
import {
  Compass,
  History,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Plus,
  Paperclip,
  Columns,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { DecisionRoom, TeamMember } from '../types/decision';
import { StatusBadge } from './StatusBadge';

interface DashboardViewProps {
  decisions: DecisionRoom[];
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onOpenRoom: (roomId: string) => void;
  onNewDecision: () => void;
  onViewMemory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  decisions,
  teamMembers,
  currentUser,
  onOpenRoom,
  onNewDecision,
  onViewMemory,
}) => {
  const activeDecisions = decisions.filter(
    (d) => d.status !== 'Decided' && d.status !== 'Archived'
  );
  const finalizedThisMonth = decisions.filter((d) => d.status === 'Decided');
  const awaitingInput = decisions.filter(
    (d) => d.status === 'Needs input' || d.status === 'In discussion'
  );
  const unresolvedObjectionsTotal = decisions.reduce((acc, d) => {
    return (
      acc +
      (d.objections?.filter(
        (o) => o.status === 'Open' || o.status === 'Under discussion'
      ).length || 0)
    );
  }, 0);

  const decisionsNeedingAttention = decisions.filter((d) => {
    const hasUnresolved = d.objections?.some(
      (o) => o.status === 'Open' || o.status === 'Under discussion'
    );
    const lowEvidence = (d.evidence?.length || 0) < 2;
    return d.status !== 'Decided' && (hasUnresolved || lowEvidence);
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-stone-500 text-sm mt-1 max-w-2xl leading-relaxed">
            Welcome to your team's decision headquarters. Commonroom captures
            trade-offs, evidence, and minority objections before consensus
            happens.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewMemory}
            className="px-3.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors flex items-center gap-2"
          >
            <History className="w-3.5 h-3.5 text-stone-500" />
            <span>Browse Decision Memory</span>
          </button>
          <button
            onClick={onNewDecision}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start New Decision</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Active Decision Rooms</span>
            <Compass className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {activeDecisions.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Across 3 cross-functional pods
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Awaiting Team Input</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {awaitingInput.length}
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">
            Requires criteria scoring
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Unresolved Objections</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {unresolvedObjectionsTotal}
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">
            Formal blockers active
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Finalized in Memory</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {finalizedThisMonth.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Searchable rationale archived
          </div>
        </div>
      </div>

      {/* Dual-column section: Active Decisions + Attention Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Decisions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Live Decision Rooms
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              Sorted by recent team activity
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {decisions.map((room) => {
              const owner = teamMembers.find((m) => m.id === room.ownerId);
              const openObjections =
                room.objections?.filter(
                  (o) => o.status === 'Open' || o.status === 'Under discussion'
                ).length || 0;
              const evidenceCount = room.evidence?.length || 0;
              const altCount = room.alternatives?.length || 0;

              return (
                <div
                  key={room.id}
                  onClick={() => onOpenRoom(room.id)}
                  className="p-5 bg-white border border-stone-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 text-xs text-stone-500">
                        <StatusBadge status={room.status} />
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-stone-600">
                          {room.category}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400 font-mono">
                        {room.lastActivity}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-stone-900 mt-2.5 group-hover:text-indigo-600 transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {room.question}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    {/* Owner */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          owner?.color || 'bg-stone-500'
                        } text-white flex items-center justify-center font-bold text-[10px]`}
                      >
                        {owner?.avatar || '??'}
                      </div>
                      <span className="text-stone-700 font-medium">
                        {owner?.name}
                      </span>
                    </div>

                    {/* Stats Badges */}
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span
                        className="flex items-center gap-1 text-stone-600"
                        title="Competing alternatives"
                      >
                        <Columns className="w-3.5 h-3.5 text-stone-400" />
                        <span className="tabular-nums">{altCount}</span> options
                      </span>

                      <span
                        className="flex items-center gap-1 text-stone-600"
                        title="Attached evidence items"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-stone-400" />
                        <span className="tabular-nums">{evidenceCount}</span> evidence
                      </span>

                      {openObjections > 0 ? (
                        <span
                          className="flex items-center gap-1 text-rose-600 font-semibold"
                          title="Unresolved disagreements"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                          <span className="tabular-nums">{openObjections}</span> objections
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          0 blockers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Decisions Needing Attention + Recent Activity */}
        <div className="space-y-6">
          {/* Needs Attention Box */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Decisions Needing Attention</span>
            </div>
            <p className="text-xs text-amber-800 mt-1">
              Rooms with unaddressed objections or approaching target sign-off
              dates:
            </p>

            <div className="mt-3 space-y-2">
              {decisionsNeedingAttention.slice(0, 3).map((room) => (
                <div
                  key={room.id}
                  onClick={() => onOpenRoom(room.id)}
                  className="p-2.5 bg-white border border-amber-200 rounded-lg text-xs hover:border-amber-400 transition-colors cursor-pointer group"
                >
                  <div className="font-medium text-stone-900 truncate group-hover:text-indigo-600">
                    {room.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                    <span className="text-amber-700 font-medium">
                      {room.objections?.filter((o) => o.status === 'Open').length ||
                        0}{' '}
                      open objection(s)
                    </span>
                    <span className="font-mono text-stone-400">
                      Target: {room.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Team Activity Log */}
          <div className="p-4 bg-white border border-stone-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                Recent Deliberation Activity
              </span>
              <Activity className="w-3.5 h-3.5 text-stone-400" />
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-[10px]">
                  AM
                </div>
                <div>
                  <p className="text-stone-700 leading-snug">
                    <strong className="text-stone-900 font-semibold">
                      Alex Morgan
                    </strong>{' '}
                    challenged the pricing assumption in <em>Launch a free plan</em>.
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono">
                    14m ago
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-[10px]">
                  MP
                </div>
                <div>
                  <p className="text-stone-700 leading-snug">
                    <strong className="text-stone-900 font-semibold">
                      Maya Patel
                    </strong>{' '}
                    attached customer interview evidence from Gong.
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono">
                    2h ago
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-[10px]">
                  SC
                </div>
                <div>
                  <p className="text-stone-700 leading-snug">
                    <strong className="text-stone-900 font-semibold">
                      Sarah Chen
                    </strong>{' '}
                    resolved objection on infrastructure cost capping.
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Yesterday
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-[10px]">
                  DK
                </div>
                <div>
                  <p className="text-stone-700 leading-snug">
                    <strong className="text-stone-900 font-semibold">
                      Daniel Kim
                    </strong>{' '}
                    finalized decision:{' '}
                    <em>Desktop Power-User Focus in Q4</em>.
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Oct 14
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
