import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AddAlternativeModalProps {
  onClose: () => void;
  onAdd: (data: {
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    effort: string;
    impact: string;
  }) => void;
}

export const AddAlternativeModal: React.FC<AddAlternativeModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [advantages, setAdvantages] = useState('');
  const [disadvantages, setDisadvantages] = useState('');
  const [effort, setEffort] = useState('Medium (2-3 sprints)');
  const [impact, setImpact] = useState('High');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim(),
      advantages: advantages
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      disadvantages: disadvantages
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      effort,
      impact,
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-bold text-stone-900 text-sm">
            Add Competing Alternative
          </h3>
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
              Alternative Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Option C: Introduce Usage-Based Credits"
              className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of how this option operates in practice..."
              className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-emerald-800 mb-1">
              Advantages (one per line)
            </label>
            <textarea
              rows={2}
              value={advantages}
              onChange={(e) => setAdvantages(e.target.value)}
              placeholder="Lower churn&#10;Better virality"
              className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-rose-800 mb-1">
              Disadvantages (one per line)
            </label>
            <textarea
              rows={2}
              value={disadvantages}
              onChange={(e) => setDisadvantages(e.target.value)}
              placeholder="High build effort&#10;Customer confusion"
              className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Estimated Effort
              </label>
              <select
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
              >
                <option value="Low (1 sprint)">Low (1 sprint)</option>
                <option value="Medium (2-3 sprints)">Medium (2-3 sprints)</option>
                <option value="High (4+ sprints)">High (4+ sprints)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Expected Impact
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-xs transition-colors"
            >
              Add to Canvas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
