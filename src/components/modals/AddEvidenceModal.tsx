import React, { useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import { Alternative, SentimentType } from '../../types/decision';

interface AddEvidenceModalProps {
  alternatives: Alternative[];
  onClose: () => void;
  onAdd: (data: {
    title: string;
    source: string;
    url?: string;
    sentiment: SentimentType;
    linkedAltId: string | null;
    content: string;
  }) => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  alternatives,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [url, setUrl] = useState('');
  const [sentiment, setSentiment] = useState<SentimentType>('Supports');
  const [linkedAltId, setLinkedAltId] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAdd({
      title: title.trim(),
      source: source.trim() || 'Internal Notes',
      url: url.trim() || undefined,
      sentiment,
      linkedAltId: linkedAltId || null,
      content: content.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-stone-900 text-sm">
              Attach Supporting Evidence
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
              Evidence Headline / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FullStory Session Replay Drop-off Analysis"
              className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Synthesis / Key Findings
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Summarize the quantitative metrics, verbatim quotes, or analytical teardown..."
              className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Evidence Stance
              </label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as SentimentType)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
              >
                <option value="Supports">Supports this option</option>
                <option value="Challenges">Challenges this option</option>
                <option value="Neutral">Neutral observation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Linked Alternative
              </label>
              <select
                value={linkedAltId}
                onChange={(e) => setLinkedAltId(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-mono"
              >
                <option value="">Whole Decision</option>
                {alternatives.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Source Name
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Gong / Mixpanel"
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Source Link (URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://gong.io/... or https://notion.so/..."
                className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
              />
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
              Attach Evidence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
