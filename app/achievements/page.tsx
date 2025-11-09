'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BADGE_TYPES, checkBadgeEligibility, Badge } from '@/lib/badges';
import NFTMintSuccess from '@/components/NFTMintSuccess';
import BadgeMintSuccess from '@/components/BadgeMintSuccess';

interface UserStats {
  questionsAsked: number;
  daosCreated: number;
  daosJoined: number;
  totalContributed: number;
  earnedBadges: string[];
}

export default function AchievementsPage() {
  const [stats, setStats] = useState<UserStats>({
    questionsAsked: 0,
    daosCreated: 0,
    daosJoined: 0,
    totalContributed: 0,
    earnedBadges: [],
  });

  const [walletAddress] = useState('34bRQivU8f8MMF5QuGMe7cxnsYtEjgWEBCdmManksCWa');
const [minting, setMinting] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [mintedBadge, setMintedBadge] = useState<Badge | null>(null);
const [mintAddress, setMintAddress] = useState('');

const handleMintBadge = async (badge: Badge) => {
  setMinting(true);

  try {
    const response = await fetch('/api/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        courseName: badge.name,
        topic: badge.description,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Update earned badges
      const updatedStats = {
        ...stats,
        earnedBadges: [...stats.earnedBadges, badge.id],
      };
      setStats(updatedStats);
      localStorage.setItem('user-stats', JSON.stringify(updatedStats));

      // Show success modal
      setMintedBadge(badge);
      setMintAddress(data.mintAddress);
      setShowSuccessModal(true);
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    console.error('Mint error:', error);
    alert(`Minting failed: ${error.message}`);
  } finally {
    setMinting(false);
  }
};

  useEffect(() => {
    // Load user stats from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user-stats');
      if (saved) {
        setStats(JSON.parse(saved));
      }
    }
  }, []);

  const earnedBadges = BADGE_TYPES.filter(badge => 
    stats.earnedBadges.includes(badge.id)
  );

  const availableBadges = BADGE_TYPES.filter(badge => 
    !stats.earnedBadges.includes(badge.id) && 
    checkBadgeEligibility(badge.id, stats)
  );

  const lockedBadges = BADGE_TYPES.filter(badge => 
    !stats.earnedBadges.includes(badge.id) && 
    !checkBadgeEligibility(badge.id, stats)
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500/30';
      case 'rare': return 'text-blue-400 border-blue-500/30';
      case 'epic': return 'text-purple-400 border-purple-500/30';
      case 'legendary': return 'text-yellow-400 border-yellow-500/30';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                StudyDAO
              </h1>
            </Link>
            <div className="flex gap-4">
              <Link href="/daos" className="px-4 py-2 text-purple-300 hover:text-white transition-all">
                DAOs
              </Link>
              <Link href="/tutor" className="px-4 py-2 text-purple-300 hover:text-white transition-all">
                AI Tutor
              </Link>
              <Link href="/achievements" className="px-4 py-2 text-white font-semibold">
                Achievements
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Your Achievements</h1>
          <p className="text-purple-300 text-lg">Earn badges by learning and contributing to DAOs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.questionsAsked}</div>
            <div className="text-sm text-purple-300">Questions Asked</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.daosJoined}</div>
            <div className="text-sm text-purple-300">DAOs Joined</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.totalContributed.toFixed(2)}</div>
            <div className="text-sm text-purple-300">SOL Contributed</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{earnedBadges.length}/{BADGE_TYPES.length}</div>
            <div className="text-sm text-purple-300">Badges Earned</div>
          </div>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">🏆 Earned Badges</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gradient-to-br ${badge.color} p-6 rounded-xl border-2 ${getRarityColor(badge.rarity)} transform hover:scale-105 transition-all`}
                >
                  <div className="text-6xl text-center mb-3">{badge.icon}</div>
                  <h3 className="text-white font-bold text-center mb-2">{badge.name}</h3>
                  <p className="text-white/80 text-sm text-center mb-2">{badge.description}</p>
                  <div className={`text-xs text-center uppercase font-bold ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available to Claim */}
        {availableBadges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">✨ Ready to Claim</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-purple-900/30 border-2 border-green-500/50 p-6 rounded-xl relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 text-green-400 text-2xl animate-pulse">✓</div>
                  <div className="text-6xl text-center mb-3">{badge.icon}</div>
                  <h3 className="text-white font-bold text-center mb-2">{badge.name}</h3>
                  <p className="text-gray-300 text-sm text-center mb-2">{badge.description}</p>
                  <div className={`text-xs text-center uppercase font-bold ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </div>
                  <button 
                    onClick={() => handleMintBadge(badge)}
                    className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all">
                    🪙 Mint as NFT
                    </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">🔒 Locked Badges</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl opacity-60"
              >
                <div className="text-6xl text-center mb-3 grayscale">{badge.icon}</div>
                <h3 className="text-gray-400 font-bold text-center mb-2">{badge.name}</h3>
                <p className="text-gray-500 text-sm text-center mb-2">{badge.description}</p>
                <div className="text-xs text-center text-gray-500 mb-2">
                  Requirement: {badge.requirement}
                </div>
                <div className={`text-xs text-center uppercase font-bold ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Badge Mint Success Modal */}
      {showSuccessModal && mintedBadge && (
        <BadgeMintSuccess
          badge={mintedBadge}
          mintAddress={mintAddress}
          onClose={() => {
            setShowSuccessModal(false);
            setMintedBadge(null);
          }}
        />
      )}
    </div>
  );
}