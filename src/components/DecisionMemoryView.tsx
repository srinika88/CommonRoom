import React, { useState } from 'react';
import { Search, X, CheckCircle2, History, Filter, User } from 'lucide-react';
import { DecisionRoom, TeamMember } from '../types/decision';

interface DecisionMemoryViewProps {
  decisions: DecisionRoom[];
  teamMembers: TeamMember[];
  onOpenRoom: (roomId: string) => void;
  initialQuery?: string;
}

export const DecisionMemoryView: React.FC<DecisionMemoryViewProps> = ({
  decisions,
  teamMembers,
  onOpenRoom,
  initialQuery = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterOwner, setFilterOwner] = useState('All');

  const finalizedDecisions = decisions.filter((d) => d.status === 'Decided');

  const filtered = finalizedDecisions.filter((d) => {
    const matchesCategory =
      filterCategory === 'All' || d.category === filterCategory;
    const matchesOwner = filterOwner === 'All' || d.ownerId === filterOwner;
    const q = searchTerm.toLowerCase().trim();
    const matchesQuery =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.question.toLowerCase().includes(q) ||
      d.context.toLowerCase().includes(q) ||
      (d.finalRecord?.rationale &&
        d.finalRecord.rationale.toLowerCase().includes(q)) ||
      (d.finalRecord?.chosenAltName &&
        d.finalRecord.chosenAltName.toLowerCase().includes(q));

    return matchesCategory && matchesOwner && matchesQuery;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Decision Memory Archive
        </h1>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Searchable institutional memory. Answer "Why did we make this decision
          six months ago?" in seconds without combing Slack messages or Google
          Docs.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 border border-stone-200 rounded-xl shadow-xs">
        <div className="flex-1 min-w-[260px] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs">
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across questions, rationales, evidence quotes, and dissenting objections..."
            className="w-full bg-transparent outline-none text-stone-800 placeholder-stone-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          aria-label="Filter decisions by category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-700 outline-none hover:border-stone-300 cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Pricing & Monetization">Pricing & Monetization</option>
          <option value="Product Strategy">Product Strategy</option>
          <option value="Infrastructure & Finance">Infrastructure & Finance</option>
          <option value="Product Growth">Product Growth</option>
        </select>

        <select
          aria-label="Filter decisions by owner"
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
          className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-700 outline-none hover:border-stone-300 cursor-pointer"
        >
          <option value="All">All Owners</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Archived Records List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((dec) => {
            const owner = teamMembers.find((m) => m.id === dec.ownerId);
            const record = dec.finalRecord;
            return (
              <div
                key={dec.id}
                onClick={() => onOpenRoom(dec.id)}
                className="p-6 bg-white border border-stone-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="text-emerald-700 font-semibold font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Finalized
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{dec.category}</span>
                    </div>
                    <h2 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {dec.title}
                    </h2>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    {record?.finalizedAt
                      ? new Date(record.finalizedAt).toLocaleDateString()
                      : 'Archived'}
                  </span>
                </div>

                {/* Chosen option & rationale snippet */}
                {record && (
                  <div className="p-3.5 bg-stone-50 border border-stone-100 rounded-lg space-y-1.5 text-xs">
                    <div className="text-indigo-800 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chosen Pathway: {record.chosenAltName}</span>
                    </div>
                    <p className="text-stone-600 line-clamp-2 leading-relaxed">
                      <strong className="text-stone-800">Rationale: </strong>
                      {record.rationale}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-100 font-mono">
                  <span>Owner: {owner?.name}</span>
                  <span>
                    <span className="tabular-nums">
                      {dec.evidence?.length || 0}
                    </span>{' '}
                    evidence preserved ·{' '}
                    <span className="tabular-nums">
                      {dec.objections?.length || 0}
                    </span>{' '}
                    objections archived
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-xl">
            No finalized decisions found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
