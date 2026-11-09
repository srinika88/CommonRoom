import React, { useState, useEffect, useMemo } from 'react';
import { DecisionRoom, NotificationItem, TeamMember } from './types/decision';
import { SEEDED_DECISIONS, SEEDED_TEAM } from './data/seedData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DecisionRoomView } from './components/DecisionRoomView';
import { DecisionMemoryView } from './components/DecisionMemoryView';
import { MyContributionsView } from './components/MyContributionsView';
import { TeamActivityView } from './components/TeamActivityView';
import { SettingsView } from './components/SettingsView';
import { NewDecisionModal } from './components/modals/NewDecisionModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

export default function App() {
  // Persistence state in localStorage
  const [decisions, setDecisions] = useState<DecisionRoom[]>(() => {
    try {
      const saved = localStorage.getItem('commonroom_decisions_v2');
      return saved ? JSON.parse(saved) : SEEDED_DECISIONS;
    } catch {
      return SEEDED_DECISIONS;
    }
  });

  const [teamMembers] = useState<TeamMember[]>(SEEDED_TEAM);
  const [currentUserId, setCurrentUserId] = useState<string>('usr-1'); // Default to Sarah Chen (PM)
  const currentUser = useMemo(
    () => teamMembers.find((u) => u.id === currentUserId) || teamMembers[0],
    [currentUserId, teamMembers]
  );

  // Navigation: 'dashboard' | 'room' | 'contributions' | 'memory' | 'activity' | 'settings'
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeRoomId, setActiveRoomId] = useState<string>('dec-1');

  // Modals
  const [isNewDecisionModalOpen, setIsNewDecisionModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      text: 'Alex Morgan challenged the infrastructure cost assumption in "Should we launch a free plan?"',
      time: '18m ago',
      unread: true,
      roomId: 'dec-1',
    },
    {
      id: 'notif-2',
      text: 'Maya Patel posted evidence from 15 Gong Exit Interviews.',
      time: '2h ago',
      unread: true,
      roomId: 'dec-1',
    },
    {
      id: 'notif-3',
      text: 'Decision finalized: Desktop Power-User Focus in Q4.',
      time: 'Oct 14',
      unread: false,
      roomId: 'dec-4',
    },
  ]);

  // Persist decisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commonroom_decisions_v2', JSON.stringify(decisions));
    } catch (e) {
      console.error('Failed to save decisions to localStorage:', e);
    }
  }, [decisions]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeRoom = useMemo(() => {
    return (
      decisions.find((d) => d.id === activeRoomId) || decisions[0] || SEEDED_DECISIONS[0]
    );
  }, [decisions, activeRoomId]);

  const updateActiveRoom = (updatedRoom: DecisionRoom) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === updatedRoom.id ? updatedRoom : d))
    );
  };

  const handleOpenRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setCurrentView('room');
  };

  const handleCreateDecision = (newDecisionData: {
    title: string;
    question: string;
    context: string;
    category: string;
    deadline: string;
  }) => {
    const newDecision: DecisionRoom = {
      id: `dec-${Date.now()}`,
      ...newDecisionData,
      status: 'In discussion',
      ownerId: currentUser.id,
      visibility: 'Team Public',
      createdAt: new Date().toISOString(),
      lastActivity: 'Just now',
      alternatives: [
        {
          id: `alt-${Date.now()}-1`,
          name: 'Option A (Initial Proposal)',
          description: 'Primary pathway under active evaluation.',
          advantages: ['Immediate direct solution'],
          disadvantages: ['Resource trade-offs'],
          effort: 'Medium',
          impact: 'High',
          coords: { x: 50, y: 50 },
          criteriaScores: {},
        },
      ],
      evidence: [],
      arguments: [],
      objections: [],
      finalRecord: null,
    };

    setDecisions((prev) => [newDecision, ...prev]);
    setActiveRoomId(newDecision.id);
    setCurrentView('room');
    setIsNewDecisionModalOpen(false);
  };

  const resetDemoData = () => {
    if (confirm('Reset Commonroom demo data to initial clean state?')) {
      setDecisions(SEEDED_DECISIONS);
      setActiveRoomId('dec-1');
      setCurrentView('dashboard');
      try {
        localStorage.setItem('commonroom_decisions_v2', JSON.stringify(SEEDED_DECISIONS));
      } catch {}
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#fbfbfa] text-stone-900 font-sans antialiased overflow-hidden select-none">
      {/* PERSISTENT SIDEBAR */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        decisions={decisions}
        activeRoomId={activeRoomId}
        onOpenRoom={handleOpenRoom}
        onNewDecision={() => setIsNewDecisionModalOpen(true)}
        teamMembers={teamMembers}
        currentUser={currentUser}
        onSelectUser={setCurrentUserId}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP BAR */}
        <Header
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
          notifications={notifications}
          onMarkNotificationsRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
          }
          onSelectRoom={handleOpenRoom}
          onResetDemo={resetDemoData}
          onNewDecision={() => setIsNewDecisionModalOpen(true)}
        />

        {/* VIEW ROUTING */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {currentView === 'dashboard' && (
            <DashboardView
              decisions={decisions}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onOpenRoom={handleOpenRoom}
              onNewDecision={() => setIsNewDecisionModalOpen(true)}
              onViewMemory={() => setCurrentView('memory')}
            />
          )}

          {currentView === 'room' && (
            <DecisionRoomView
              room={activeRoom}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onUpdateRoom={updateActiveRoom}
              onNavigateMemory={() => setCurrentView('memory')}
            />
          )}

          {currentView === 'memory' && (
            <DecisionMemoryView
              decisions={decisions}
              teamMembers={teamMembers}
              onOpenRoom={handleOpenRoom}
            />
          )}

          {currentView === 'contributions' && (
            <MyContributionsView
              decisions={decisions}
              currentUser={currentUser}
              teamMembers={teamMembers}
              onOpenRoom={handleOpenRoom}
            />
          )}

          {currentView === 'activity' && (
            <TeamActivityView
              decisions={decisions}
              teamMembers={teamMembers}
              onOpenRoom={handleOpenRoom}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              teamMembers={teamMembers}
              currentUser={currentUser}
              onReset={resetDemoData}
            />
          )}
        </main>
      </div>

      {/* GLOBAL SEARCH MODAL */}
      {isGlobalSearchOpen && (
        <GlobalSearchModal
          decisions={decisions}
          teamMembers={teamMembers}
          onClose={() => setIsGlobalSearchOpen(false)}
          onSelectRoom={(roomId) => {
            handleOpenRoom(roomId);
            setIsGlobalSearchOpen(false);
          }}
        />
      )}

      {/* NEW DECISION MODAL */}
      {isNewDecisionModalOpen && (
        <NewDecisionModal
          teamMembers={teamMembers}
          currentUser={currentUser}
          onClose={() => setIsNewDecisionModalOpen(false)}
          onCreate={handleCreateDecision}
        />
      )}
    </div>
  );
}
