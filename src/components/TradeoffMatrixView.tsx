import React, { useState } from 'react';
import { Plus, Sliders, Check } from 'lucide-react';
import { DecisionRoom, TeamMember } from '../types/decision';

interface TradeoffMatrixViewProps {
  room: DecisionRoom;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onUpdateRoom: (updated: DecisionRoom) => void;
}

export const TradeoffMatrixView: React.FC<TradeoffMatrixViewProps> = ({
  room,
  teamMembers,
  currentUser,
  onUpdateRoom,
}) => {
  const [criteria, setCriteria] = useState<string[]>([
    'Customer Impact',
    'Revenue Potential',
    'Engineering Effort',
    'Time to Market',
    'Strategic Alignment',
  ]);
  const [isAddingCriterion, setIsAddingCriterion] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState('');

  const handleScoreChange = (
    altId: string,
    criterion: string,
    newScore: number,
    note?: string
  ) => {
    const updatedAlts = room.alternatives.map((alt) => {
      if (alt.id === altId) {
        const currentScores = alt.criteriaScores || {};
        return {
          ...alt,
          criteriaScores: {
            ...currentScores,
            [criterion]: {
              score: Number(newScore),
              authorId: currentUser.id,
              note:
                note !== undefined
                  ? note
                  : currentScores[criterion]?.note || '',
            },
          },
        };
      }
      return alt;
    });

    onUpdateRoom({ ...room, alternatives: updatedAlts, lastActivity: 'Just now' });
  };

  const handleAddCustomCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;
    if (!criteria.includes(newCriterionName.trim())) {
      setCriteria([...criteria, newCriterionName.trim()]);
    }
    setNewCriterionName('');
    setIsAddingCriterion(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Trade-off & Criteria Comparison Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare alternatives across multi-dimensional criteria. Scores reflect
            team attribution and can be adjusted collaboratively.
          </p>
        </div>

        <div>
          {isAddingCriterion ? (
            <form onSubmit={handleAddCustomCriterion} className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={newCriterionName}
                onChange={(e) => setNewCriterionName(e.target.value)}
                placeholder="e.g. Compliance Risk"
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg outline-none focus:border-indigo-600 bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-stone-900 text-white text-xs rounded-lg font-medium hover:bg-stone-800"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCriterion(false)}
                className="text-stone-400 hover:text-stone-700 text-xs px-1"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingCriterion(true)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Decision Criterion</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-56 font-semibold">Decision Criterion</th>
                {room.alternatives?.map((alt) => (
                  <th
                    key={alt.id}
                    className="py-3 px-4 font-semibold text-stone-900 min-w-[260px]"
                  >
                    {alt.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {criteria.map((criterion) => (
                <tr key={criterion} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-stone-800 bg-stone-50/30 align-top">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-stone-400" />
                      <span>{criterion}</span>
                    </div>
                  </td>
                  {room.alternatives?.map((alt) => {
                    const scoreData = alt.criteriaScores?.[criterion] || {
                      score: 5,
                      authorId: room.ownerId,
                      note: 'Default estimate',
                    };
                    const author = teamMembers.find(
                      (m) => m.id === scoreData.authorId
                    );

                    return (
                      <td key={alt.id} className="py-4 px-4 align-top space-y-2.5">
                        {/* Score Slider & Numeric Badge */}
                        <div className="flex items-center justify-between gap-3">
                          <input
                            aria-label={`${criterion} score for ${alt.name}`}
                            type="range"
                            min="1"
                            max="10"
                            value={scoreData.score}
                            onChange={(e) =>
                              handleScoreChange(
                                alt.id,
                                criterion,
                                Number(e.target.value)
                              )
                            }
                            className="w-32 accent-indigo-600 cursor-pointer"
                          />
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs tabular-nums ${
                              scoreData.score >= 8
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : scoreData.score >= 5
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {scoreData.score} / 10
                          </span>
                        </div>

                        {/* Attributed Author */}
                        <div className="text-[11px] text-stone-500 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span className="text-stone-400">Scored by:</span>
                            <strong className="text-stone-700">
                              {author?.name || 'Teammate'}
                            </strong>
                          </span>
                        </div>

                        {/* Explanatory note */}
                        {scoreData.note ? (
                          <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2 rounded-lg border border-stone-100 leading-snug">
                            "{scoreData.note}"
                          </p>
                        ) : (
                          <button
                            onClick={() => {
                              const note = prompt(
                                `Add reasoning note for ${criterion} on ${alt.name}:`
                              );
                              if (note !== null) {
                                handleScoreChange(
                                  alt.id,
                                  criterion,
                                  scoreData.score,
                                  note
                                );
                              }
                            }}
                            className="text-[10px] text-stone-400 hover:text-indigo-600 italic"
                          >
                            + add reason note
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
