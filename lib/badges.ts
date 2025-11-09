export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  color: string;
}

export const BADGE_TYPES: Badge[] = [
  {
    id: 'first-question',
    name: 'Curious Beginner',
    description: 'Asked your first AI question',
    icon: '🌱',
    rarity: 'common',
    requirement: 'Ask 1 question',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'active-learner',
    name: 'Active Learner',
    description: 'Asked 10 AI questions',
    icon: '📚',
    rarity: 'common',
    requirement: 'Ask 10 questions',
    color: 'from-blue-400 to-cyan-600',
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Asked 50 AI questions',
    icon: '🔍',
    rarity: 'rare',
    requirement: 'Ask 50 questions',
    color: 'from-purple-400 to-pink-600',
  },
  {
    id: 'dao-founder',
    name: 'DAO Founder',
    description: 'Created a Study DAO',
    icon: '👑',
    rarity: 'rare',
    requirement: 'Create a DAO',
    color: 'from-yellow-400 to-orange-600',
  },
  {
    id: 'generous-contributor',
    name: 'Generous Contributor',
    description: 'Contributed to DAO treasury',
    icon: '💎',
    rarity: 'rare',
    requirement: 'Contribute SOL',
    color: 'from-pink-400 to-rose-600',
  },
  {
    id: 'dao-patron',
    name: 'DAO Patron',
    description: 'Contributed 1+ SOL to treasury',
    icon: '🏦',
    rarity: 'epic',
    requirement: 'Contribute 1 SOL',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    id: 'master-scholar',
    name: 'Master Scholar',
    description: 'Asked 100 AI questions',
    icon: '🎓',
    rarity: 'epic',
    requirement: 'Ask 100 questions',
    color: 'from-violet-400 to-purple-600',
  },
  {
    id: 'ai-expert',
    name: 'AI Expert',
    description: 'Asked 250 AI questions',
    icon: '🧠',
    rarity: 'legendary',
    requirement: 'Ask 250 questions',
    color: 'from-amber-400 via-orange-500 to-red-600',
  },
  {
    id: 'community-champion',
    name: 'Community Champion',
    description: 'Member of 5+ DAOs',
    icon: '⭐',
    rarity: 'legendary',
    requirement: 'Join 5 DAOs',
    color: 'from-yellow-300 via-yellow-500 to-yellow-700',
  },
];

export function checkBadgeEligibility(
  badgeId: string,
  stats: {
    questionsAsked: number;
    daosCreated: number;
    daosJoined: number;
    totalContributed: number;
  }
): boolean {
  switch (badgeId) {
    case 'first-question':
      return stats.questionsAsked >= 1;
    case 'active-learner':
      return stats.questionsAsked >= 10;
    case 'knowledge-seeker':
      return stats.questionsAsked >= 50;
    case 'master-scholar':
      return stats.questionsAsked >= 100;
    case 'ai-expert':
      return stats.questionsAsked >= 250;
    case 'dao-founder':
      return stats.daosCreated >= 1;
    case 'generous-contributor':
      return stats.totalContributed > 0;
    case 'dao-patron':
      return stats.totalContributed >= 1;
    case 'community-champion':
      return stats.daosJoined >= 5;
    default:
      return false;
  }
}