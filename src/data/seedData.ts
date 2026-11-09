import { DecisionRoom, TeamMember } from '../types/decision';

export const SEEDED_TEAM: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Sarah Chen',
    role: 'Product Manager',
    email: 'sarah@commonroom.internal',
    avatar: 'SC',
    color: 'bg-emerald-600',
    systemRole: 'Admin',
  },
  {
    id: 'usr-2',
    name: 'Alex Morgan',
    role: 'Engineering Lead',
    email: 'alex@commonroom.internal',
    avatar: 'AM',
    color: 'bg-blue-600',
    systemRole: 'Decision Owner',
  },
  {
    id: 'usr-3',
    name: 'Maya Patel',
    role: 'Product Designer',
    email: 'maya@commonroom.internal',
    avatar: 'MP',
    color: 'bg-purple-600',
    systemRole: 'Contributor',
  },
  {
    id: 'usr-4',
    name: 'Daniel Kim',
    role: 'Founder & CEO',
    email: 'daniel@commonroom.internal',
    avatar: 'DK',
    color: 'bg-amber-600',
    systemRole: 'Admin',
  },
  {
    id: 'usr-5',
    name: 'Olivia Brown',
    role: 'Customer Success Lead',
    email: 'olivia@commonroom.internal',
    avatar: 'OB',
    color: 'bg-rose-600',
    systemRole: 'Contributor',
  },
];

export const SEEDED_DECISIONS: DecisionRoom[] = [
  {
    id: 'dec-1',
    title: 'Should we launch a free plan for our SaaS product?',
    question:
      'Should we introduce a perpetual free tier to widen top-of-funnel acquisition, or stick to a high-intent trial?',
    context:
      'Our main competitors (Linear, Notion, Miro) offer free plans with usage limits. We need to decide whether a free tier will increase qualified product adoption enough to justify the additional infrastructure costs, tier spam, and customer support load.',
    status: 'In discussion',
    ownerId: 'usr-1',
    deadline: '2026-11-20',
    visibility: 'Team Public',
    category: 'Pricing & Monetization',
    createdAt: '2026-11-01T10:00:00Z',
    lastActivity: '12 minutes ago',
    alternatives: [
      {
        id: 'alt-1',
        name: 'Option A: Launch a Perpetual Free Plan',
        description:
          'Free forever up to 3 team members and 5 active decision rooms. No credit card required.',
        advantages: [
          'Widens top of funnel by estimated 4.5x',
          'Drives organic viral word of mouth in tech teams',
          'Matches market expectation in modern B2B tools',
        ],
        disadvantages: [
          'Estimated +$14k/month in raw hosting and infrastructure costs',
          'Support queue could be swamped by non-paying users',
          'Risk of cannibalizing initial $29/seat tier',
        ],
        effort: 'Medium (3 sprints)',
        impact: 'Very High',
        coords: { x: 30, y: 40 },
        criteriaScores: {
          'Customer Impact': {
            score: 9,
            authorId: 'usr-3',
            note: 'Allows designers to adopt without begging for finance approval.',
          },
          'Revenue Potential': {
            score: 7,
            authorId: 'usr-1',
            note: 'Higher top-of-funnel conversion compensates lower direct signups.',
          },
          'Engineering Effort': {
            score: 6,
            authorId: 'usr-2',
            note: 'Limits enforcement and bot mitigation required.',
          },
          'Time to Market': {
            score: 8,
            authorId: 'usr-1',
            note: 'Can reuse existing tier permission flags.',
          },
          'Strategic Alignment': {
            score: 9,
            authorId: 'usr-4',
            note: 'PLG is our primary thesis for series A.',
          },
        },
      },
      {
        id: 'alt-2',
        name: 'Option B: Keep Paid-Only Model ($29/user)',
        description:
          'Maintain strict 14-day reverse trial, requiring paid subscription to proceed afterwards.',
        advantages: [
          'Guarantees high buyer intent and serious teams',
          'Keeps support overhead predictable and minimal',
          'Positions Commonroom as a premium, high-craft tool',
        ],
        disadvantages: [
          'Friction for individual contributors testing without credit card',
          'Competitors capture the bottom-up enterprise wedge',
          'Sign-up conversion drops ~38% based on Q3 experiments',
        ],
        effort: 'Low (0 sprints)',
        impact: 'Low',
        coords: { x: 420, y: 40 },
        criteriaScores: {
          'Customer Impact': {
            score: 4,
            authorId: 'usr-3',
            note: 'Frustrating for users who just want to test one decision.',
          },
          'Revenue Potential': {
            score: 5,
            authorId: 'usr-4',
            note: 'Predictable ARPU, but slower logo growth.',
          },
          'Engineering Effort': {
            score: 10,
            authorId: 'usr-2',
            note: 'Zero engineering work needed.',
          },
          'Time to Market': {
            score: 10,
            authorId: 'usr-1',
            note: 'Already running.',
          },
          'Strategic Alignment': {
            score: 5,
            authorId: 'usr-1',
            note: 'Leaves us vulnerable to bottom-up disruption.',
          },
        },
      },
      {
        id: 'alt-3',
        name: 'Option C: Interactive 30-Day Project Sandbox',
        description:
          'Offer one active unlimited decision room for up to 30 days. No recurring team-wide free tier, but a generous per-project playground.',
        advantages: [
          'Teams experience full collaborative value on an actual live decision',
          'Caps infrastructure costs strictly after 30 days',
          'Clear conversion moment when decision room reaches conclusion',
        ],
        disadvantages: [
          'More complex state logic (room archiving lifecycle)',
          'Requires custom conversion nurture sequence',
          'Slightly more nuanced to explain on pricing page',
        ],
        effort: 'Medium-High (4 sprints)',
        impact: 'High',
        coords: { x: 810, y: 40 },
        criteriaScores: {
          'Customer Impact': {
            score: 8,
            authorId: 'usr-5',
            note: 'Gives teams enough time to finish a real decision.',
          },
          'Revenue Potential': {
            score: 8,
            authorId: 'usr-1',
            note: 'Highest propensity to convert at point of decision finalization.',
          },
          'Engineering Effort': {
            score: 5,
            authorId: 'usr-2',
            note: 'Requires automated archival and grace-period alerts.',
          },
          'Time to Market': {
            score: 7,
            authorId: 'usr-1',
            note: 'Doable within Q4.',
          },
          'Strategic Alignment': {
            score: 8,
            authorId: 'usr-4',
            note: 'Great hybrid balance.',
          },
        },
      },
    ],
    evidence: [
      {
        id: 'ev-1',
        title: 'Q3 Competitor Pricing Tear-down',
        source: 'Product Analytics & Pricing Teardown Sheet',
        authorId: 'usr-1',
        date: '2026-11-02',
        sentiment: 'Supports',
        linkedAltId: 'alt-1',
        url: 'https://notion.so/pricing-matrix-q3',
        content:
          '9 of 11 comparable B2B collaboration tools offer a perpetual free plan. Companies with free tiers report 3.2x faster organic team invite velocity.',
      },
      {
        id: 'ev-2',
        title: 'Infra Cost Simulation under 50k Free Workspaces',
        source: 'AWS & PlanetScale Load Modelling',
        authorId: 'usr-2',
        date: '2026-11-04',
        sentiment: 'Challenges',
        linkedAltId: 'alt-1',
        url: 'https://grafana.internal/d/infra-sim',
        content:
          'Real-time WebSocket connection state and canvas history retention would cost approximately $14,200/mo at 50,000 active free teams, with no revenue offset.',
      },
      {
        id: 'ev-3',
        title: '15 Customer Success Exit Interviews',
        source: 'Gong Call Transcripts',
        authorId: 'usr-5',
        date: '2026-11-06',
        sentiment: 'Supports',
        linkedAltId: 'alt-3',
        url: 'https://gong.io/calls/exit-evaluations',
        content:
          '73% of churned trials stated: "14 days was not enough time to rally 4 cross-functional executives around one real decision."',
      },
      {
        id: 'ev-4',
        title: 'Self-Serve Conversion Benchmarks (OpenView 2026)',
        source: 'Industry Report',
        authorId: 'usr-4',
        date: '2026-11-07',
        sentiment: 'Neutral',
        linkedAltId: null,
        url: 'https://openviewpartners.com/plg-benchmarks',
        content:
          'Freemium to paid conversion benchmarks in work collaboration hover around 3.8% – 5.1%.',
      },
    ],
    arguments: [
      {
        id: 'arg-1',
        altId: 'alt-1',
        authorId: 'usr-3',
        type: 'pro',
        timestamp: '2026-11-03T14:32:00Z',
        text: "Designers won't advocate for Commonroom if they can't just drop a link in Slack and have engineers click in immediately without an enterprise SSO or credit card wall.",
        reactions: { thumbsUp: 3, thumbsDown: 0 },
        replies: [
          {
            id: 'rep-1',
            authorId: 'usr-2',
            text: "Agreed on friction, but we must have strict rate-limits so a bot farm doesn't wipe our LLM and DB tokens.",
            timestamp: '2026-11-03T15:10:00Z',
          },
        ],
      },
      {
        id: 'arg-2',
        altId: 'alt-2',
        authorId: 'usr-4',
        type: 'pro',
        timestamp: '2026-11-04T09:15:00Z',
        text: 'Paid-only guarantees we talk only to serious teams with actual executive decision authority. We avoid low-value feature requests.',
        reactions: { thumbsUp: 1, thumbsDown: 2 },
        replies: [],
      },
      {
        id: 'arg-3',
        altId: 'alt-3',
        authorId: 'usr-1',
        type: 'pro',
        timestamp: '2026-11-05T11:45:00Z',
        text: "Option C ties our trial directly to the user's actual goal (resolving one real decision). Once they experience the finalized Decision Record, they're primed to purchase the team plan.",
        reactions: { thumbsUp: 4, thumbsDown: 0 },
        replies: [],
      },
    ],
    objections: [
      {
        id: 'obj-1',
        altId: 'alt-1',
        raisedById: 'usr-2',
        assignedToId: 'usr-1',
        title: 'Uncapped infrastructure and LLM compute liability',
        reason:
          'If we allow unlimited canvas state and AI assistant runs on a perpetual free plan, our margins will turn negative before Series A.',
        status: 'Accepted as a known risk',
        importance: 'High',
        resolutionNotes:
          'Mitigated by capping free workspaces at 25 AI assistant queries per month and archiving inactive rooms after 90 days.',
        createdAt: '2026-11-03T16:00:00Z',
      },
      {
        id: 'obj-2',
        altId: 'alt-3',
        raisedById: 'usr-5',
        assignedToId: 'usr-3',
        title: 'User confusion around 30-day decision deadline',
        reason:
          'Users might worry their intellectual reasoning will be locked hostage or deleted if their company deliberation takes 35 days.',
        status: 'Under discussion',
        importance: 'Medium',
        resolutionNotes: '',
        createdAt: '2026-11-06T13:20:00Z',
      },
    ],
    finalRecord: null,
  },
  {
    id: 'dec-2',
    title: 'Should we rebuild our onboarding experience from scratch?',
    question:
      'Do we overhaul the current step-by-step wizard into an interactive "First Decision" canvas walkthrough?',
    context:
      'Activation drop-off between signup and inviting a 2nd team member is currently 61%. We need to resolve whether to iterate on the wizard or replace it with an interactive workspace.',
    status: 'Needs input',
    ownerId: 'usr-3',
    deadline: '2026-11-28',
    visibility: 'Team Public',
    category: 'Product Growth',
    createdAt: '2026-11-04T08:30:00Z',
    lastActivity: '3 hours ago',
    alternatives: [
      {
        id: 'alt-201',
        name: 'Interactive "First Decision" Canvas Template',
        description:
          'Drop user directly into a pre-populated "Choose our offsite location" decision room.',
        advantages: ['Teaches by doing', 'Instant understanding of visual canvas'],
        disadvantages: ['Higher cognitive load on first 10 seconds'],
        effort: 'High (4 sprints)',
        impact: 'High',
        coords: { x: 50, y: 50 },
        criteriaScores: {},
      },
      {
        id: 'alt-202',
        name: 'Streamlined 3-Step Linear Checklist',
        description:
          'Simple side-drawer checklist: 1. Create Question, 2. Add Alternative, 3. Share URL.',
        advantages: ['Safe, predictable, minimal dev work'],
        disadvantages: ['Does not showcase the power of argument mapping'],
        effort: 'Low (1 sprint)',
        impact: 'Medium',
        coords: { x: 450, y: 50 },
        criteriaScores: {},
      },
    ],
    evidence: [
      {
        id: 'ev-201',
        title: 'FullStory Session Replay Synthesis',
        source: 'Product Analytics',
        authorId: 'usr-3',
        date: '2026-11-05',
        sentiment: 'Supports',
        linkedAltId: 'alt-201',
        content:
          'Users spend 85% of their initial time staring blankly at the empty room header.',
      },
    ],
    arguments: [],
    objections: [
      {
        id: 'obj-201',
        altId: 'alt-201',
        raisedById: 'usr-2',
        assignedToId: 'usr-3',
        title: 'Risk of overwhelming first-time non-technical users',
        reason:
          'Opening straight onto a full canvas with 20 nodes might cause instant bounce.',
        status: 'Open',
        importance: 'High',
        resolutionNotes: '',
        createdAt: '2026-11-05T14:00:00Z',
      },
    ],
    finalRecord: null,
  },
  {
    id: 'dec-3',
    title: 'Which global payment provider should we choose for international expansion?',
    question:
      'Should we expand our billing infrastructure using Stripe Billing, Adyen, or Paddle as Merchant of Record?',
    context:
      'Expanding into EU and APAC requires VAT/GST compliance and localized payment options (SEPA, iDEAL, Alipay).',
    status: 'In discussion',
    ownerId: 'usr-2',
    deadline: '2026-12-05',
    visibility: 'Team Public',
    category: 'Infrastructure & Finance',
    createdAt: '2026-10-28T16:00:00Z',
    lastActivity: 'Yesterday',
    alternatives: [
      {
        id: 'alt-301',
        name: 'Stripe Billing + Stripe Tax',
        description:
          'Stay in existing Stripe ecosystem and enable automatic tax calculation and localized rails.',
        advantages: [
          'Minimal migration code',
          'Excellent developer DX',
          'Unified dashboard',
        ],
        disadvantages: ['We remain entity liable for filing local foreign taxes'],
        effort: 'Low-Medium (2 sprints)',
        impact: 'Medium',
        coords: { x: 40, y: 40 },
        criteriaScores: {},
      },
      {
        id: 'alt-302',
        name: 'Paddle (Merchant of Record)',
        description:
          'Offload all global sales tax, remittance, and compliance liability to Paddle.',
        advantages: [
          'Zero accounting burden abroad',
          'Handles invoices & cross-border FX seamlessly',
        ],
        disadvantages: [
          '5% + 50c take rate (higher cost)',
          'Less customizable checkout components',
        ],
        effort: 'High (5 sprints rewrite)',
        impact: 'Very High',
        coords: { x: 450, y: 40 },
        criteriaScores: {},
      },
    ],
    evidence: [],
    arguments: [],
    objections: [],
    finalRecord: null,
  },
  {
    id: 'dec-4',
    title:
      'Should we prioritize desktop power-user improvements over a mobile companion app in Q4?',
    question:
      'Should our core product engineering focus on keyboard shortcuts, offline sync, and fast navigation, or launch an iOS review app?',
    context:
      'We have 2 engineering pods available. Customer surveys showed 78% desktop usage during deliberation meetings, but executives demanded mobile approval notifications.',
    status: 'Decided',
    ownerId: 'usr-1',
    deadline: '2026-10-15',
    visibility: 'Team Public',
    category: 'Product Strategy',
    createdAt: '2026-10-01T09:00:00Z',
    lastActivity: 'Finalized Oct 14',
    alternatives: [
      {
        id: 'alt-401',
        name: 'Desktop Power-User Focus (Command-K, Quick Triage, Hotkeys)',
        description:
          'Invest 100% of bandwidth into sub-100ms desktop responsiveness and Figma-grade canvas controls.',
        advantages: [
          'Delights the daily operators (PMs, tech leads)',
          'Deepens defensive competitive moat',
        ],
        disadvantages: [
          'Executives still cannot approve decisions from their phones in transit',
        ],
        effort: 'Medium (3 sprints)',
        impact: 'High',
        coords: { x: 40, y: 40 },
        criteriaScores: {},
      },
      {
        id: 'alt-402',
        name: 'Lightweight Mobile Companion (iOS / PWA)',
        description:
          'Build a mobile app focused only on notifications, quick approvals, and reading decision summaries.',
        advantages: [
          'Satisfies executive stakeholders',
          'Faster sign-off turnaround time',
        ],
        disadvantages: ['High maintenance burden for mobile webview wrapper'],
        effort: 'High (6 sprints)',
        impact: 'Medium',
        coords: { x: 440, y: 40 },
        criteriaScores: {},
      },
    ],
    evidence: [
      {
        id: 'ev-401',
        title: 'Q3 Analytics Device Breakdown',
        source: 'Mixpanel Metrics',
        authorId: 'usr-1',
        date: '2026-10-05',
        sentiment: 'Supports',
        linkedAltId: 'alt-401',
        content:
          '94.2% of decision room interactions happen between 9 AM and 5 PM on macOS and Windows desktop viewports.',
      },
    ],
    arguments: [
      {
        id: 'arg-401',
        altId: 'alt-401',
        authorId: 'usr-2',
        type: 'pro',
        timestamp: '2026-10-08T10:00:00Z',
        text: 'Trying to support mobile canvas manipulation with touch gestures will consume our entire quarter and produce a mediocre experience.',
        reactions: { thumbsUp: 5, thumbsDown: 0 },
        replies: [],
      },
    ],
    objections: [
      {
        id: 'obj-401',
        altId: 'alt-401',
        raisedById: 'usr-4',
        assignedToId: 'usr-1',
        title: 'VP-level decision signoffs may stall over weekends',
        reason:
          'Leadership personas check email on mobile and might block decisions when away from desks.',
        status: 'Accepted as a known risk',
        importance: 'High',
        resolutionNotes:
          'We implemented email-based one-click approval links so mobile signoff does not require a native application.',
        createdAt: '2026-10-10T12:00:00Z',
      },
    ],
    finalRecord: {
      finalizedAt: '2026-10-14T17:30:00Z',
      finalizedById: 'usr-1',
      chosenAltId: 'alt-401',
      chosenAltName:
        'Desktop Power-User Focus (Command-K, Quick Triage, Hotkeys)',
      rationale:
        'Our product wedge is deep collaborative deliberation during synthesis and product spec meetings. 94% of sessions are desktop-based. By focusing on desktop velocity and adding one-click email voting for executives, we satisfy signoff speed without draining engineering resources on a native mobile build.',
      rejectedAlternativesSummary: [
        {
          name: 'Lightweight Mobile Companion (iOS / PWA)',
          reason:
            'High ongoing maintenance overhead and poor ROI relative to our desktop-first core workflow.',
        },
      ],
      preservedObjections: [
        'VP-level decision signoffs may stall over weekends (Accepted as known risk; mitigated via email interactive buttons).',
      ],
    },
  },
  {
    id: 'dec-5',
    title:
      'Should we transition from per-seat pricing to hybrid usage-based billing?',
    question:
      'Should we introduce token/decision-based metering alongside base user seats for enterprise accounts?',
    context:
      'Some enterprise customers have 200 passive readers and only 8 active decision facilitators, leading to hesitation on enterprise-wide seat licenses.',
    status: 'Draft',
    ownerId: 'usr-4',
    deadline: '2026-12-15',
    visibility: 'Restricted (Leadership)',
    category: 'Pricing & Monetization',
    createdAt: '2026-11-06T11:00:00Z',
    lastActivity: '2 days ago',
    alternatives: [],
    evidence: [],
    arguments: [],
    objections: [],
    finalRecord: null,
  },
];
