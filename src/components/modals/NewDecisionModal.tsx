import React, { useState } from 'react';
import { Scale, X } from 'lucide-react';
import { TeamMember } from '../../types/decision';

interface NewDecisionModalProps {
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    question: string;
    context: string;
    category: string;
    deadline: string;
  }) => void;
}

export const NewDecisionModal: React.FC<NewDecisionModalProps> = ({
  teamMembers,
  currentUser,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState('Product Strategy');
  const [deadline, setDeadline] = useState('2026-12-01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) return;
    onCreate({ title, question, context, category, deadline });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-stone-900 text-sm">
              Create New Decision Room
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Decision Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Should we deprecate our legacy v1 API?"
              className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Core Framing Question
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Do we sunset v1 by Q2, or maintain support via proxy adapters?"
              className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Background Context
            </label>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Explain why this decision is being made right now and what is at stake..."
              className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
              >
                <option value="Product Strategy">Product Strategy</option>
                <option value="Pricing & Monetization">
                  Pricing & Monetization
                </option>
                <option value="Infrastructure & Finance">
                  Infrastructure & Finance
                </option>
                <option value="Engineering Architecture">
                  Engineering Architecture
                </option>
                <option value="Product Growth">Product Growth</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Target Decision Date
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              Open Decision Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
