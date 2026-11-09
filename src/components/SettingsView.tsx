import React from 'react';
import { RotateCcw, Shield, Users, Sliders } from 'lucide-react';
import { TeamMember } from '../types/decision';

interface SettingsViewProps {
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  teamMembers,
  currentUser,
  onReset,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage team stakeholders, collaboration roles, deliberation defaults,
          and system state.
        </p>
      </div>

      {/* Team Members List */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono">
              Team Stakeholders
            </span>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {teamMembers.length} Active Stakeholders
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {teamMembers.map((m) => (
            <div
              key={m.id}
              className="py-3 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${m.color} text-white flex items-center justify-center font-bold text-xs`}
                >
                  {m.avatar}
                </div>
                <div>
                  <div className="font-semibold text-stone-900">{m.name}</div>
                  <div className="text-stone-400 text-[11px] font-mono">
                    {m.role} · {m.email}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
                {m.systemRole}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Deliberation Rules & Defaults */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-stone-500" />
          <span className="font-bold uppercase tracking-wider text-stone-600 font-mono">
            Deliberation Governance Defaults
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
            <span className="font-semibold text-stone-800">
              Preserved Objections Policy
            </span>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Dissenting objections marked "Accepted as known risk" are committed
              to permanent memory without silencing dissent.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
            <span className="font-semibold text-stone-800">
              Required Evidence Threshold
            </span>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Rooms trigger an attention flag if fewer than 2 distinct evidence
              sources are attached prior to the sign-off deadline.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-stone-900">
            Reset Demo State
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Restore all decisions, evidence, objections, and criteria scores to
            factory sample data.
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-3.5 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Decisions</span>
        </button>
      </div>
    </div>
  );
};
