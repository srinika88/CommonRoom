import React from 'react';
import {
  Scale,
  Compass,
  History,
  Activity,
  User,
  Settings,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { DecisionRoom, TeamMember } from '../types/decision';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  decisions: DecisionRoom[];
  activeRoomId: string;
  onOpenRoom: (id: string) => void;
  onNewDecision: () => void;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onSelectUser: (userId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  decisions,
  activeRoomId,
  onOpenRoom,
  onNewDecision,
  teamMembers,
  currentUser,
  onSelectUser,
}) => {
  const finalizedCount = decisions.filter((d) => d.status === 'Decided').length;
  const activeRooms = decisions.filter((d) => d.status !== 'Archived');

  return (
    <aside className="w-64 flex-shrink-0 bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800 z-30 select-none">
      {/* Brand Logo & Product Tagline */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-100 text-sm tracking-tight">
                Commonroom
              </span>
              <span className="text-[10px] uppercase font-mono px-1 py-0.5 bg-stone-800 text-stone-400 rounded">
                v1.2
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-none mt-0.5">
              Decision Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Context */}
      <div className="px-4 py-3 bg-stone-950/40 border-b border-stone-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-stone-200 truncate">
            Acme SaaS · Core Product
          </span>
        </div>
        <span className="text-stone-500 font-mono text-[11px]">B2B</span>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 px-3 mb-2 font-mono">
            Workspace
          </div>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('memory')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'memory'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Decision Memory</span>
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-mono">
              {finalizedCount}
            </span>
          </button>

          <button
            onClick={() => setCurrentView('contributions')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'contributions'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Contributions</span>
          </button>

          <button
            onClick={() => setCurrentView('activity')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'activity'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Team Activity</span>
          </button>
        </div>

        {/* Active Decision Rooms Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 font-mono">
              Rooms ({activeRooms.length})
            </div>
            <button
              onClick={onNewDecision}
              className="text-stone-400 hover:text-white p-0.5 rounded hover:bg-stone-800 transition-colors"
              title="New Decision Room"
              aria-label="New Decision Room"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {activeRooms.map((room) => {
              const isActive =
                currentView === 'room' && activeRoomId === room.id;
              const unresolvedCount =
                room.objections?.filter(
                  (o) => o.status === 'Open' || o.status === 'Under discussion'
                ).length || 0;

              return (
                <button
                  key={room.id}
                  onClick={() => onOpenRoom(room.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between group transition-colors ${
                    isActive
                      ? 'bg-indigo-950/80 text-indigo-200 border-l-2 border-indigo-500 pl-2.5'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                  }`}
                >
                  <span className="truncate pr-2 flex-1">{room.title}</span>
                  {unresolvedCount > 0 && (
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono"
                      title={`${unresolvedCount} unresolved objection`}
                    >
                      {unresolvedCount} !
                    </span>
                  )}
                  {room.status === 'Decided' && (
                    <span
                      className="flex-shrink-0 text-emerald-400"
                      title="Finalized Decision"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Settings */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 px-3 mb-2 font-mono">
            System
          </div>
          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'settings'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Team</span>
          </button>
        </div>
      </div>

      {/* Persona Switcher / Active User Banner */}
      <div className="p-3 bg-stone-950/90 border-t border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div
            className={`w-7 h-7 rounded-full ${currentUser.color} text-white flex items-center justify-center font-semibold text-xs`}
          >
            {currentUser.avatar}
          </div>
          <div className="truncate">
            <div className="text-xs font-medium text-stone-200 truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-stone-400 truncate">
              {currentUser.role}
            </div>
          </div>
        </div>

        {/* Quick Persona Switch Dropdown */}
        <select
          aria-label="Switch active persona"
          value={currentUser.id}
          onChange={(e) => onSelectUser(e.target.value)}
          className="bg-stone-900 border border-stone-700 text-stone-300 text-[11px] rounded px-1.5 py-1 outline-none hover:border-stone-500 cursor-pointer"
          title="Switch active persona to test collaborative views"
        >
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.systemRole})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};
