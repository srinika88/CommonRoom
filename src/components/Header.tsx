import React, { useState } from 'react';
import { Search, Bell, RotateCcw, Plus, Check } from 'lucide-react';
import { NotificationItem } from '../types/decision';

interface HeaderProps {
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onSelectRoom: (roomId: string) => void;
  onResetDemo: () => void;
  onNewDecision: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  notifications,
  onMarkNotificationsRead,
  onSelectRoom,
  onResetDemo,
  onNewDecision,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-14 border-b border-stone-200 bg-white flex items-center justify-between px-6 z-20 flex-shrink-0">
      {/* Zone 1: Command Search trigger */}
      <div className="flex items-center gap-3 w-96">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-400 hover:text-stone-600 hover:border-stone-300 bg-stone-50/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <span className="whitespace-nowrap truncate">Search decisions, rationales, evidence...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-500 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 2: Workspace Status indicator */}
      <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 font-mono">
        <span>Workspace Mode: Active Deliberation</span>
      </div>

      {/* Zone 3: Actions & Notifications */}
      <div className="flex items-center gap-3">
        {/* Notifications popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 relative transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 shadow-xl rounded-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-800">
                  Room Notifications
                </span>
                <button
                  onClick={onMarkNotificationsRead}
                  className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              </div>
              <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.roomId) onSelectRoom(n.roomId);
                      setNotificationsOpen(false);
                    }}
                    className={`p-2.5 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors ${
                      n.unread ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <div className="text-stone-700 leading-relaxed">{n.text}</div>
                    <div className="text-[10px] text-stone-400 mt-1 font-mono">
                      {n.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo reset */}
        <button
          onClick={onResetDemo}
          className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          title="Reset application to initial demo state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
          <span>Demo State</span>
        </button>

        {/* Primary Action: New Decision */}
        <button
          onClick={onNewDecision}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Decision</span>
        </button>
      </div>
    </header>
  );
};
