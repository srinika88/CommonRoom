import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { Alternative, ObjectionImportance, TeamMember } from '../../types/decision';

interface RaiseObjectionModalProps {
  alternatives: Alternative[];
  teamMembers: TeamMember[];
  onClose: () => void;
  onRaise: (data: {
    title: string;
    reason: string;
    altId?: string;
    importance: ObjectionImportance;
    assignedToId: string;
  }) => void;
}

export const RaiseObjectionModal: React.FC<RaiseObjectionModalProps> = ({
  alternatives,
  teamMembers,
  onClose,
  onRaise,
}) => {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [altId, setAltId] = useState(alternatives[0]?.id || '');
  const [importance, setImportance] = useState<ObjectionImportance>('High');
  const [assignedToId, setAssignedToId] = useState(teamMembers[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reason.trim()) return;
    onRaise({
      title: title.trim(),
      reason: reason.trim(),
      altId: altId || undefined,
      importance,
      assignedToId: assignedToId || teamMembers[0]?.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="font-bold text-stone-900 text-sm">
              Raise Formal Objection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Objection Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free plan compute will exceed our AWS unit economics"
              className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-rose-500 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Risk Statement (Why this matters)
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explicitly describe what could go wrong and why current assumptions are fragile..."
              className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-rose-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Alternative Challenged
              </label>
              <select
                value={altId}
                onChange={(e) => setAltId(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
              >
                {alternatives.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Severity / Importance
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as ObjectionImportance)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono font-medium"
              >
                <option value="Critical Blocker">Critical Blocker</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Assign Teammate to Investigate
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-xs transition-colors"
            >
              Record Formal Objection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
