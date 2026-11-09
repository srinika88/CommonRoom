export type DecisionStatus =
  | 'Draft'
  | 'In discussion'
  | 'Needs input'
  | 'Ready to decide'
  | 'Decided'
  | 'Archived';

export type SentimentType = 'Supports' | 'Challenges' | 'Neutral';

export type ObjectionStatus =
  | 'Open'
  | 'Under discussion'
  | 'Addressed'
  | 'Accepted as a known risk';

export type ObjectionImportance = 'Critical Blocker' | 'High' | 'Medium';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  color: string;
  systemRole: string;
}

export interface CriteriaScore {
  score: number;
  authorId: string;
  note?: string;
}

export interface Alternative {
  id: string;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  effort: string;
  impact: string;
  coords: { x: number; y: number };
  criteriaScores: Record<string, CriteriaScore>;
}

export interface Evidence {
  id: string;
  title: string;
  source: string;
  authorId: string;
  date: string;
  sentiment: SentimentType;
  linkedAltId: string | null;
  url?: string;
  content: string;
}

export interface ArgumentReply {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Argument {
  id: string;
  altId: string;
  authorId: string;
  type: 'pro' | 'con';
  timestamp: string;
  text: string;
  reactions: {
    thumbsUp: number;
    thumbsDown: number;
  };
  replies: ArgumentReply[];
}

export interface Objection {
  id: string;
  altId?: string;
  raisedById: string;
  assignedToId: string;
  title: string;
  reason: string;
  status: ObjectionStatus;
  importance: ObjectionImportance;
  resolutionNotes?: string;
  createdAt: string;
}

export interface FinalRecord {
  finalizedAt: string;
  finalizedById: string;
  chosenAltId: string;
  chosenAltName: string;
  rationale: string;
  rejectedAlternativesSummary: Array<{
    name: string;
    reason: string;
  }>;
  preservedObjections: string[];
}

export interface DecisionRoom {
  id: string;
  title: string;
  question: string;
  context: string;
  status: DecisionStatus;
  ownerId: string;
  deadline: string;
  visibility: string;
  category: string;
  createdAt: string;
  lastActivity: string;
  alternatives: Alternative[];
  evidence: Evidence[];
  arguments: Argument[];
  objections: Objection[];
  finalRecord: FinalRecord | null;
}

export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  roomId?: string;
}
