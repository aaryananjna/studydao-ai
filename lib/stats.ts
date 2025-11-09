interface UserStats {
  questionsAsked: number;
  daosCreated: number;
  daosJoined: number;
  totalContributed: number;
  earnedBadges: string[];
}

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return {
      questionsAsked: 0,
      daosCreated: 0,
      daosJoined: 0,
      totalContributed: 0,
      earnedBadges: [],
    };
  }

  const saved = localStorage.getItem('user-stats');
  if (saved) {
    return JSON.parse(saved);
  }

  return {
    questionsAsked: 0,
    daosCreated: 0,
    daosJoined: 0,
    totalContributed: 0,
    earnedBadges: [],
  };
}

export function updateUserStats(updates: Partial<UserStats>) {
  if (typeof window === 'undefined') return;

  const current = getUserStats();
  const updated = { ...current, ...updates };
  localStorage.setItem('user-stats', JSON.stringify(updated));
}

export function incrementStat(stat: keyof Omit<UserStats, 'earnedBadges'>, amount: number = 1) {
  const current = getUserStats();
  const updated = {
    ...current,
    [stat]: current[stat] + amount,
  };
  localStorage.setItem('user-stats', JSON.stringify(updated));
}

export function earnBadge(badgeId: string) {
  const current = getUserStats();
  if (!current.earnedBadges.includes(badgeId)) {
    current.earnedBadges.push(badgeId);
    localStorage.setItem('user-stats', JSON.stringify(current));
    return true; // Badge newly earned
  }
  return false; // Already had this badge
}