import React, { useState } from 'react';
import {
  Plus,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  MessageSquare,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Alternative, DecisionRoom, TeamMember } from '../types/decision';

interface AlternativesCanvasViewProps {
  room: DecisionRoom;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onAddAlternative: () => void;
  onRaiseObjection: () => void;
  onAddArgument: (data: { altId: string; type: 'pro' | 'con'; text: string }) => void;
}

export const AlternativesCanvasView: React.FC<AlternativesCanvasViewProps> = ({
  room,
  teamMembers,
  currentUser,
  onAddAlternative,
  onRaiseObjection,
  onAddArgument,
}) => {
  const [quickArgAltId, setQuickArgAltId] = useState<string | null>(null);
  const [quickArgText, setQuickArgText] = useState('');
  const [quickArgType, setQuickArgType] = useState<'pro' | 'con'>('pro');

  return (
    <div className="h-full w-full p-8 canvas-dot-grid overflow-auto relative min-w-[900px] min-h-[700px]">
      {/* Canvas Action Ribbon */}
      <div className="sticky top-0 left-0 inline-flex items-center gap-3 z-10 glass-header px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs mb-6">
        <span className="text-xs font-semibold text-stone-800 font-mono">
          Visual Alternatives Canvas ({room.alternatives?.length || 0})
        </span>
        <div className="h-4 w-px bg-stone-200" />
        <button
          onClick={onAddAlternative}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Alternative</span>
        </button>
        <button
          onClick={onRaiseObjection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-colors whitespace-nowrap"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Raise Formal Objection</span>
        </button>
      </div>

      {/* Alternative Cards Grid */}
      <div className="flex flex-wrap gap-6 items-start pb-12">
        {room.alternatives &&
          room.alternatives.map((alt, idx) => {
            const evidenceLinked =
              room.evidence?.filter((e) => e.linkedAltId === alt.id) || [];
            const objectionsLinked =
              room.objections?.filter((o) => o.altId === alt.id) || [];
            const argumentsLinked =
              room.arguments?.filter((a) => a.altId === alt.id) || [];

            return (
              <div
                key={alt.id}
                className="w-96 bg-white border border-stone-200 rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col relative group"
              >
                {/* Card Header & Badges */}
                <div className="p-5 border-b border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[11px] text-stone-400 uppercase font-semibold">
                      Alternative #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500">
                      <span>Effort: {alt.effort || 'Medium'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-600 font-semibold">
                        Impact: {alt.impact || 'High'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {alt.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {alt.description}
                  </p>
                </div>

                {/* Advantages & Disadvantages */}
                <div className="p-5 space-y-4 flex-1">
                  {/* Advantages */}
                  <div>
                    <div className="text-[11px] uppercase font-semibold tracking-wide text-emerald-800 font-mono flex items-center gap-1.5 mb-2">
                      <ThumbsUp className="w-3 h-3 text-emerald-600" />
                      <span>Advantages</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {alt.advantages &&
                        alt.advantages.map((adv, i) => (
                          <li key={i} className="flex items-start gap-2 leading-snug">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Disadvantages */}
                  <div>
                    <div className="text-[11px] uppercase font-semibold tracking-wide text-rose-800 font-mono flex items-center gap-1.5 mb-2">
                      <ThumbsDown className="w-3 h-3 text-rose-600" />
                      <span>Disadvantages</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {alt.disadvantages &&
                        alt.disadvantages.map((dis, i) => (
                          <li key={i} className="flex items-start gap-2 leading-snug">
                            <span className="text-rose-600 font-bold">✗</span>
                            <span>{dis}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer: Metadata counts & Inline composer trigger */}
                <div className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 rounded-b-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
                    <span
                      className="flex items-center gap-1"
                      title="Attached Evidence"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-stone-400" />
                      <span className="tabular-nums">{evidenceLinked.length}</span>
                    </span>
                    <span
                      className="flex items-center gap-1"
                      title="Arguments Count"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span className="tabular-nums">{argumentsLinked.length}</span>
                    </span>
                    {objectionsLinked.length > 0 ? (
                      <span
                        className="flex items-center gap-1 text-rose-600 font-semibold"
                        title="Formal Objections"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span className="tabular-nums">{objectionsLinked.length}</span> obj
                      </span>
                    ) : (
                      <span className="text-emerald-600" title="Zero blockers">
                        0 obj
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setQuickArgAltId(
                        quickArgAltId === alt.id ? null : alt.id
                      )
                    }
                    className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium transition-colors"
                  >
                    + Add Perspective
                  </button>
                </div>

                {/* Inline Argument Composer Flyout */}
                {quickArgAltId === alt.id && (
                  <div className="p-3 bg-white border-t border-stone-200 text-xs space-y-2 rounded-b-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-700">
                        Add Perspective
                      </span>
                      <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-md">
                        <button
                          type="button"
                          onClick={() => setQuickArgType('pro')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            quickArgType === 'pro'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          + Pro
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickArgType('con')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            quickArgType === 'con'
                              ? 'bg-rose-600 text-white font-bold'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          - Con
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={quickArgText}
                      onChange={(e) => setQuickArgText(e.target.value)}
                      placeholder={`State why this option ${
                        quickArgType === 'pro' ? 'will succeed' : 'is flawed'
                      }...`}
                      className="w-full text-xs p-2 border border-stone-200 rounded-lg outline-none focus:border-indigo-500 bg-stone-50"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setQuickArgAltId(null)}
                        className="px-2 py-1 text-stone-400 hover:text-stone-700 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!quickArgText.trim()) return;
                          onAddArgument({
                            altId: alt.id,
                            text: quickArgText,
                            type: quickArgType,
                          });
                          setQuickArgText('');
                          setQuickArgAltId(null);
                        }}
                        className="px-3 py-1 bg-stone-900 text-white rounded text-[11px] font-medium hover:bg-stone-800"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
