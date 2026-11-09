import React, { useState } from 'react';
import {
  Grid,
  Scale,
  ShieldAlert,
  History,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import {
  DecisionRoom,
  ObjectionStatus,
  TeamMember,
} from '../types/decision';
import { StatusBadge } from './StatusBadge';
import { AlternativesCanvasView } from './AlternativesCanvasView';
import { TradeoffMatrixView } from './TradeoffMatrixView';
import { DisagreementsTrackerView } from './DisagreementsTrackerView';
import { DecisionRecordView } from './DecisionRecordView';
import { AddAlternativeModal } from './modals/AddAlternativeModal';
import { AddEvidenceModal } from './modals/AddEvidenceModal';
import { RaiseObjectionModal } from './modals/RaiseObjectionModal';
import { FinalizeDecisionModal } from './modals/FinalizeDecisionModal';
import {
  AiAnalysisMode,
  AiAnalysisResult,
  analyzeDecisionRoom,
} from '../services/aiService';

interface DecisionRoomViewProps {
  room: DecisionRoom;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onUpdateRoom: (updated: DecisionRoom) => void;
  onNavigateMemory: () => void;
}

export const DecisionRoomView: React.FC<DecisionRoomViewProps> = ({
  room,
  teamMembers,
  currentUser,
  onUpdateRoom,
  onNavigateMemory,
}) => {
  // Tabs: 'canvas' | 'tradeoffs' | 'disagreements' | 'record'
  const [activeTab, setActiveTab] = useState<'canvas' | 'tradeoffs' | 'disagreements' | 'record'>('canvas');

  // Right Drawer
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [rightTab, setRightTab] = useState<'assistant' | 'evidence' | 'arguments'>('assistant');

  // Modals
  const [isAddAlternativeModalOpen, setIsAddAlternativeModalOpen] = useState(false);
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [isRaiseObjectionModalOpen, setIsRaiseObjectionModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  // AI Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<AiAnalysisResult | null>(null);
  const [aiMode, setAiMode] = useState<AiAnalysisMode>('recommendation');

  const owner = teamMembers.find((m) => m.id === room.ownerId) || teamMembers[0];

  // --- Handlers ---
  const handleAddAlternative = (newAlt: {
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    effort: string;
    impact: string;
  }) => {
    const alt = {
      id: `alt-${Date.now()}`,
      name: newAlt.name,
      description: newAlt.description,
      advantages: newAlt.advantages,
      disadvantages: newAlt.disadvantages,
      effort: newAlt.effort || 'Medium',
      impact: newAlt.impact || 'Medium',
      coords: { x: 30 + (room.alternatives?.length || 0) * 380, y: 50 },
      criteriaScores: {},
    };
    onUpdateRoom({
      ...room,
      alternatives: [...(room.alternatives || []), alt],
      lastActivity: 'Just now',
    });
    setIsAddAlternativeModalOpen(false);
  };

  const handleAddEvidence = (evData: {
    title: string;
    source: string;
    url?: string;
    sentiment: 'Supports' | 'Challenges' | 'Neutral';
    linkedAltId: string | null;
    content: string;
  }) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      ...evData,
      authorId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
    };
    onUpdateRoom({
      ...room,
      evidence: [newEv, ...(room.evidence || [])],
      lastActivity: 'Just now',
    });
    setIsAddEvidenceModalOpen(false);
  };

  const handleAddArgument = (argData: {
    altId: string;
    type: 'pro' | 'con';
    text: string;
  }) => {
    const newArg = {
      id: `arg-${Date.now()}`,
      altId: argData.altId,
      authorId: currentUser.id,
      type: argData.type,
      text: argData.text,
      timestamp: new Date().toISOString(),
      reactions: { thumbsUp: 0, thumbsDown: 0 },
      replies: [],
    };
    onUpdateRoom({
      ...room,
      arguments: [newArg, ...(room.arguments || [])],
      lastActivity: 'Just now',
    });
  };

  const handleRaiseObjection = (objData: {
    title: string;
    reason: string;
    altId?: string;
    importance: 'Critical Blocker' | 'High' | 'Medium';
    assignedToId: string;
  }) => {
    const newObj = {
      id: `obj-${Date.now()}`,
      ...objData,
      raisedById: currentUser.id,
      status: 'Open' as ObjectionStatus,
      createdAt: new Date().toISOString(),
      resolutionNotes: '',
    };
    onUpdateRoom({
      ...room,
      objections: [newObj, ...(room.objections || [])],
      lastActivity: 'Just now',
    });
    setIsRaiseObjectionModalOpen(false);
  };

  const handleUpdateObjectionStatus = (
    objId: string,
    newStatus: ObjectionStatus,
    resolutionNotes = ''
  ) => {
    const updatedObjs = room.objections.map((obj) => {
      if (obj.id === objId) {
        return {
          ...obj,
          status: newStatus,
          resolutionNotes: resolutionNotes || obj.resolutionNotes,
        };
      }
      return obj;
    });
    onUpdateRoom({ ...room, objections: updatedObjs, lastActivity: 'Just now' });
  };

  const handleFinalizeDecision = (finalPayload: {
    chosenAltId: string;
    rationale: string;
    rejectedSummary: Array<{ name: string; reason: string }>;
  }) => {
    const finalized = {
      ...room,
      status: 'Decided' as const,
      lastActivity: 'Finalized just now',
      finalRecord: {
        finalizedAt: new Date().toISOString(),
        finalizedById: currentUser.id,
        chosenAltId: finalPayload.chosenAltId,
        chosenAltName:
          room.alternatives.find((a) => a.id === finalPayload.chosenAltId)
            ?.name || 'Chosen Alternative',
        rationale: finalPayload.rationale,
        rejectedAlternativesSummary: finalPayload.rejectedSummary,
        preservedObjections: room.objections.map(
          (o) =>
            `${o.title} (${o.status} - Raised by: ${
              teamMembers.find((m) => m.id === o.raisedById)?.name || 'Team'
            })`
        ),
      },
    };
    onUpdateRoom(finalized);
    setIsFinalizeModalOpen(false);
    setActiveTab('record');
  };

  const runAiCopilot = async (mode: AiAnalysisMode) => {
    setAiLoading(true);
    setAiMode(mode);
    try {
      const result = await analyzeDecisionRoom(room, mode);
      setAiOutput(result);
    } catch (err) {
      console.error('AI Copilot run error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfa] overflow-hidden">
      {/* ROOM HEADER */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-stone-500">
            <span className="font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {room.category}
            </span>
            <span aria-hidden="true">·</span>
            <StatusBadge status={room.status} />
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-500">
              Owner: {owner.name}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-500">
              Target: {room.deadline}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {room.status !== 'Decided' ? (
              <button
                onClick={() => setIsFinalizeModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finalize Decision</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('record')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-medium hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>View Decision Record</span>
              </button>
            )}

            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isRightPanelOpen
                  ? 'bg-stone-100 border-stone-300 text-stone-800'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title="Toggle Intelligence Drawer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Intelligence Drawer</span>
            </button>
          </div>
        </div>

        {/* Room Question & Context */}
        <div className="mt-2.5">
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {room.title}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-4xl leading-relaxed">
            {room.context}
          </p>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-6 mt-4 border-t border-stone-100 pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`pb-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'canvas'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Alternatives Canvas ({room.alternatives?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('tradeoffs')}
            className={`pb-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'tradeoffs'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Trade-off Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('disagreements')}
            className={`pb-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'disagreements'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              Unresolved Disagreements ({room.objections?.length || 0})
            </span>
          </button>

          {room.finalRecord && (
            <button
              onClick={() => setActiveTab('record')}
              className={`pb-2 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'record'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <History className="w-3.5 h-3.5 text-emerald-600" />
              <span>Finalized Decision Record</span>
            </button>
          )}
        </div>
      </div>

      {/* ROOM BODY SPLIT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Viewport */}
        <div className="flex-1 overflow-auto relative">
          {activeTab === 'canvas' && (
            <AlternativesCanvasView
              room={room}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onAddAlternative={() => setIsAddAlternativeModalOpen(true)}
              onRaiseObjection={() => setIsRaiseObjectionModalOpen(true)}
              onAddArgument={handleAddArgument}
            />
          )}

          {activeTab === 'tradeoffs' && (
            <TradeoffMatrixView
              room={room}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onUpdateRoom={onUpdateRoom}
            />
          )}

          {activeTab === 'disagreements' && (
            <DisagreementsTrackerView
              room={room}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onRaiseObjection={() => setIsRaiseObjectionModalOpen(true)}
              onUpdateStatus={handleUpdateObjectionStatus}
            />
          )}

          {activeTab === 'record' && (
            <DecisionRecordView
              room={room}
              teamMembers={teamMembers}
              onBackToCanvas={() => setActiveTab('canvas')}
            />
          )}
        </div>

        {/* Collapsible Right Intelligence Drawer */}
        {isRightPanelOpen && (
          <aside className="w-96 border-l border-stone-200 bg-white flex flex-col z-10 flex-shrink-0 shadow-lg">
            {/* Header Switcher */}
            <div className="p-3 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setRightTab('assistant')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    rightTab === 'assistant'
                      ? 'bg-white shadow-xs text-indigo-700 border border-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    AI Copilot
                  </span>
                </button>

                <button
                  onClick={() => setRightTab('evidence')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    rightTab === 'evidence'
                      ? 'bg-white shadow-xs text-stone-900 border border-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Evidence ({room.evidence?.length || 0})
                </button>

                <button
                  onClick={() => setRightTab('arguments')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    rightTab === 'arguments'
                      ? 'bg-white shadow-xs text-stone-900 border border-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Arguments ({room.arguments?.length || 0})
                </button>
              </div>

              <button
                onClick={() => setIsRightPanelOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB A: AI COPILOT */}
              {rightTab === 'assistant' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Deliberation Reasoning Engine</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      Synthesizes room evidence, contradictory opinions, and
                      unresolved risks without fabricating external claims.
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => runAiCopilot('recommendation')}
                      className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-900 text-left transition-colors font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Recommendation</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                        Synthesize balanced call
                      </span>
                    </button>

                    <button
                      onClick={() => runAiCopilot('conflicts')}
                      className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-left transition-colors font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-600" />
                        <span>Find Conflicts</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                        Contradictory claims
                      </span>
                    </button>

                    <button
                      onClick={() => runAiCopilot('missing')}
                      className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-left transition-colors font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Missing Evidence</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                        Unproven assumptions
                      </span>
                    </button>

                    <button
                      onClick={() => runAiCopilot('summary')}
                      className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-left transition-colors font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                        <span>Summarize Room</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                        Current stance
                      </span>
                    </button>
                  </div>

                  {/* Loading State */}
                  {aiLoading && (
                    <div className="p-8 text-center space-y-2 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/20">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-indigo-700 font-medium">
                        Analyzing live arguments & evidence...
                      </p>
                    </div>
                  )}

                  {/* AI Output Display */}
                  {!aiLoading && aiOutput && (
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="font-semibold text-stone-900">
                          {aiOutput.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                          Verified Grounds
                        </span>
                      </div>

                      {'content' in aiOutput && (
                        <p className="text-stone-700 leading-relaxed">
                          {aiOutput.content}
                        </p>
                      )}

                      {'items' in aiOutput && (
                        <div className="space-y-2">
                          {Array.isArray(aiOutput.items) &&
                            aiOutput.items.map((item, idx) => {
                              if (typeof item === 'string') {
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-stone-700 leading-snug"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={idx}
                                  className="p-2.5 bg-white border border-stone-200 rounded-lg space-y-1.5"
                                >
                                  <div className="text-stone-800 font-medium">
                                    Perspective A:{' '}
                                    <span className="font-normal text-stone-600">
                                      {item.claimA}
                                    </span>
                                  </div>
                                  <div className="text-stone-800 font-medium">
                                    Contradiction B:{' '}
                                    <span className="font-normal text-stone-600">
                                      {item.claimB}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}

                      {'recommendedAlt' in aiOutput && (
                        <div className="space-y-2.5">
                          <div className="p-2.5 bg-indigo-100/70 rounded-lg text-indigo-950 font-medium">
                            Suggested Pathway:{' '}
                            <strong className="font-bold">
                              {aiOutput.recommendedAlt}
                            </strong>
                          </div>

                          <div className="space-y-1">
                            <span className="font-semibold text-stone-800 text-[11px] uppercase tracking-wide">
                              Key Reasons:
                            </span>
                            {aiOutput.reasons.map((r, i) => (
                              <div
                                key={i}
                                className="text-stone-700 flex items-start gap-1.5 leading-snug"
                              >
                                <span className="text-emerald-600 font-bold">
                                  ✓
                                </span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-1 pt-1">
                            <span className="font-semibold text-stone-800 text-[11px] uppercase tracking-wide">
                              Residual Risks to Track:
                            </span>
                            {aiOutput.risks.map((rk, i) => (
                              <div
                                key={i}
                                className="text-amber-800 flex items-start gap-1.5 leading-snug"
                              >
                                <span className="text-amber-600 font-bold">
                                  ⚠
                                </span>
                                <span>{rk}</span>
                              </div>
                            ))}
                          </div>

                          {aiOutput.unresolvedCaveat && (
                            <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] leading-snug">
                              <strong>Pre-Finalization Check: </strong>
                              {aiOutput.unresolvedCaveat}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!aiLoading && !aiOutput && (
                    <div className="p-6 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
                      Select an analysis action above to examine live arguments,
                      trade-offs, and evidence in this room.
                    </div>
                  )}
                </div>
              )}

              {/* TAB B: EVIDENCE HUB */}
              {rightTab === 'evidence' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
                      Documented Grounds
                    </span>
                    <button
                      onClick={() => setIsAddEvidenceModalOpen(true)}
                      className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Attach Evidence</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {room.evidence && room.evidence.length > 0 ? (
                      room.evidence.map((ev) => {
                        const author = teamMembers.find(
                          (m) => m.id === ev.authorId
                        );
                        const linkedAlt = room.alternatives?.find(
                          (a) => a.id === ev.linkedAltId
                        );
                        return (
                          <div
                            key={ev.id}
                            className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase font-mono ${
                                  ev.sentiment === 'Supports'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ev.sentiment === 'Challenges'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {ev.sentiment}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {ev.date}
                              </span>
                            </div>

                            <div className="font-semibold text-stone-900 leading-snug">
                              {ev.title}
                            </div>
                            <p className="text-stone-600 leading-relaxed text-[11px]">
                              {ev.content}
                            </p>

                            {linkedAlt && (
                              <div className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block">
                                Linked: {linkedAlt.name}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px] text-stone-400">
                              <span>Added by {author?.name || 'Teammate'}</span>
                              {ev.url && (
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  <span>Source link</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
                        No evidence attached yet. Link quotes, metrics, or research notes.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB C: ARGUMENTS THREAD */}
              {rightTab === 'arguments' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
                      Argument Threads
                    </span>
                  </div>

                  <InlineComposer
                    alternatives={room.alternatives || []}
                    onSubmit={handleAddArgument}
                  />

                  <div className="space-y-3 pt-2">
                    {room.arguments && room.arguments.length > 0 ? (
                      room.arguments.map((arg) => {
                        const author = teamMembers.find(
                          (m) => m.id === arg.authorId
                        );
                        const alt = room.alternatives?.find(
                          (a) => a.id === arg.altId
                        );
                        return (
                          <div
                            key={arg.id}
                            className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-full ${
                                    author?.color || 'bg-stone-500'
                                  } text-white flex items-center justify-center font-bold text-[9px]`}
                                >
                                  {author?.avatar || '??'}
                                </div>
                                <span className="font-medium text-stone-800">
                                  {author?.name}
                                </span>
                              </div>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  arg.type === 'pro'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {arg.type === 'pro'
                                  ? '+ Supporting'
                                  : '- Counter'}
                              </span>
                            </div>

                            {alt && (
                              <div className="text-[10px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded inline-block truncate max-w-full">
                                Ref: {alt.name}
                              </div>
                            )}

                            <p className="text-stone-700 leading-relaxed text-[11px]">
                              {arg.text}
                            </p>

                            {/* Replies */}
                            {arg.replies && arg.replies.length > 0 && (
                              <div className="pl-3 border-l-2 border-stone-200 space-y-1.5 mt-2">
                                {arg.replies.map((rep) => {
                                  const repAuthor = teamMembers.find(
                                    (m) => m.id === rep.authorId
                                  );
                                  return (
                                    <div
                                      key={rep.id}
                                      className="text-[11px] bg-stone-50 p-2 rounded-lg"
                                    >
                                      <strong className="text-stone-800">
                                        {repAuthor?.name}:{' '}
                                      </strong>
                                      <span className="text-stone-600">
                                        {rep.text}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
                        No arguments posted yet. Add a pro/con perspective above.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* MODALS */}
      {isAddAlternativeModalOpen && (
        <AddAlternativeModal
          onClose={() => setIsAddAlternativeModalOpen(false)}
          onAdd={handleAddAlternative}
        />
      )}

      {isAddEvidenceModalOpen && (
        <AddEvidenceModal
          alternatives={room.alternatives || []}
          onClose={() => setIsAddEvidenceModalOpen(false)}
          onAdd={handleAddEvidence}
        />
      )}

      {isRaiseObjectionModalOpen && (
        <RaiseObjectionModal
          alternatives={room.alternatives || []}
          teamMembers={teamMembers}
          onClose={() => setIsRaiseObjectionModalOpen(false)}
          onRaise={handleRaiseObjection}
        />
      )}

      {isFinalizeModalOpen && (
        <FinalizeDecisionModal
          room={room}
          teamMembers={teamMembers}
          onClose={() => setIsFinalizeModalOpen(false)}
          onFinalize={handleFinalizeDecision}
        />
      )}
    </div>
  );
};

// Inline composer for the arguments tab
function InlineComposer({
  alternatives,
  onSubmit,
}: {
  alternatives: Array<{ id: string; name: string }>;
  onSubmit: (data: { altId: string; type: 'pro' | 'con'; text: string }) => void;
}) {
  const [text, setText] = useState('');
  const [type, setType] = useState<'pro' | 'con'>('pro');
  const [altId, setAltId] = useState(alternatives[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ altId: altId || alternatives[0]?.id || '', type, text });
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-stone-700">Add Perspective</span>
        <div className="flex items-center gap-1 p-0.5 bg-stone-200/60 rounded">
          <button
            type="button"
            onClick={() => setType('pro')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              type === 'pro'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-stone-600'
            }`}
          >
            + Pro
          </button>
          <button
            type="button"
            onClick={() => setType('con')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              type === 'con'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-stone-600'
            }`}
          >
            - Con
          </button>
        </div>
      </div>

      <select
        value={altId}
        onChange={(e) => setAltId(e.target.value)}
        className="w-full p-1.5 border border-stone-200 rounded-lg bg-white text-stone-700 text-xs outline-none"
      >
        {alternatives.map((a) => (
          <option key={a.id} value={a.id}>
            Relates to: {a.name}
          </option>
        ))}
      </select>

      <textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Document argument ${
          type === 'pro' ? 'supporting' : 'challenging'
        } this alternative...`}
        className="w-full p-2 border border-stone-200 rounded-lg bg-white text-xs outline-none focus:border-indigo-600"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
        >
          Post Argument
        </button>
      </div>
    </form>
  );
}
