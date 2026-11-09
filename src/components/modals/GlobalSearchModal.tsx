import React, { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { DecisionRoom, TeamMember } from '../../types/decision';
import { StatusBadge } from '../StatusBadge';

interface GlobalSearchModalProps {
  decisions: DecisionRoom[];
  teamMembers: TeamMember[];
  onClose: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  decisions,
  teamMembers,
  onClose,
  onSelectRoom,
}) => {
  const [term, setTerm] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    if (!term.trim()) return decisions.slice(0, 5);
    const q = term.toLowerCase().trim();
    return decisions.filter((d) => {
      return (
        d.title.toLowerCase().includes(q) ||
        d.question.toLowerCase().includes(q) ||
        d.context.toLowerCase().includes(q) ||
        d.alternatives?.some(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q)
        ) ||
        d.evidence?.some(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q)
        )
      );
    });
  }, [term, decisions]);

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-start justify-center pt-20 z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="p-3 border-b border-stone-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400 ml-1" />
          <input
            autoFocus
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search decisions, arguments, customer evidence, or trade-offs..."
            className="w-full text-sm outline-none text-stone-800 placeholder-stone-400 bg-transparent"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-400 font-mono text-[10px]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 p-2 text-xs">
          {results.length > 0 ? (
            results.map((room) => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="p-3 hover:bg-stone-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="font-semibold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {room.title}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5 truncate max-w-md">
                    {room.question}
                  </div>
                </div>
                <StatusBadge status={room.status} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-stone-400 text-xs">
              No decision records found matching "{term}".
            </div>
          )}
        </div>

        <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-400 font-mono flex items-center justify-between px-4">
          <span>Search across {decisions.length} decision rooms</span>
          <span>Commonroom Decision Engine</span>
        </div>
      </div>
    </div>
  );
};
