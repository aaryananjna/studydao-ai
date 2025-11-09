'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { incrementStat } from '@/lib/stats';

interface Member {
  address: string;
  joinedAt: string;
  contributionScore: number;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  timestamp: string;
  upvotes: number;
}

export default function DAOPage() {
  const params = useParams();
  const router = useRouter();
  const daoId = params.id as string;

  const [dao, setDao] = useState({
  name: 'Loading...',
  subject: '',
  description: '',
  memberCount: 0,
  treasuryBalance: 0,
  aiCredits: 0, 
});

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('studydao-daos');
    if (saved) {
      const daos = JSON.parse(saved);
      const currentDao = daos.find((d: any) => d.id === daoId);
      if (currentDao) {
        setDao(currentDao);
      }
    }
  }
}, [daoId]);

  const [members] = useState<Member[]>([
    { address: '34bRQi...sCWa', joinedAt: '2025-01-10', contributionScore: 150 },
    { address: '7xKXm9...pQz2', joinedAt: '2025-01-12', contributionScore: 120 },
    { address: 'Bv8Hn2...kL4m', joinedAt: '2025-01-15', contributionScore: 95 },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'How does backpropagation work in neural networks?',
      answer: 'Backpropagation calculates gradients by applying the chain rule...',
      askedBy: '34bR...sCWa',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      upvotes: 8,
    },
    {
      id: '2',
      question: 'What is the difference between L1 and L2 regularization?',
      answer: 'L1 regularization adds absolute value of weights to loss function...',
      askedBy: '7xKX...pQz2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      upvotes: 12,
    },
  ]);

  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');

  const handleJoinDAO = () => {
    setJoined(true);
    setDao({ ...dao, memberCount: dao.memberCount + 1 });
    
    // TRACK DAO JOINED
    incrementStat('daosJoined', 1);
    
    alert('🎉 Joined DAO!\n\nYou are now part of this study group!\n\n🏆 Check Achievements for new badges!');
  };

const [showContributeModal, setShowContributeModal] = useState(false);
const [contributionAmount, setContributionAmount] = useState('');

const handleContribute = () => {
  const amount = parseFloat(contributionAmount);
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount!');
    return;
  }

  const newCredits = Math.floor(amount * 100);
  
  const updatedDao = {
    ...dao,
    treasuryBalance: dao.treasuryBalance + amount,
    aiCredits: dao.aiCredits + newCredits,
  };
  
  setDao(updatedDao);
  
  
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('studydao-daos');
    if (saved) {
      const daos = JSON.parse(saved);
      const updatedDaos = daos.map((d: any) => 
        d.id === daoId ? updatedDao : d
      );
      localStorage.setItem('studydao-daos', JSON.stringify(updatedDaos));
    }
  }
  
  
  incrementStat('totalContributed', amount);
  
  setShowContributeModal(false);
  setContributionAmount('');
  
  alert(`🎉 Contribution Successful!\n\n+${amount} SOL added to treasury\n+${newCredits} AI credits unlocked!\n\n🏆 You may have earned badges - check Achievements!`);
};

  const handleAskAI = () => {
    router.push('/tutor');
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
                ← Back to DAOs
              </Link>
              <Link href="/tutor" className="px-4 py-2 text-purple-300 hover:text-white transition-all">
                AI Tutor
              </Link>
              <Link
                href="/achievements"
                className="px-4 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all"
              >
                🏆
              </Link>
            </div>
          </div>
        </div>
      </nav>


      {/* DAO Header */}
<div className="border-b border-purple-500/20 bg-purple-900/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
          📚
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{dao.name}</h1>
          <p className="text-purple-300 mb-3">{dao.description}</p>
          
          {/* NEW CREDITS DISPLAY */}
          <div className="flex gap-4 text-sm mb-2">
            <div className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <span className="text-blue-300">🤖 AI Credits: </span>
              <span className="text-blue-400 font-bold">{dao.aiCredits} questions</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <span className="text-purple-300">👥 {dao.memberCount} members</span>
            <span className="text-green-400">💰 {dao.treasuryBalance.toFixed(2)} SOL</span>
            <span className="px-2 py-1 rounded-full bg-purple-600/50 text-purple-200 text-xs">
              {dao.subject}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {!joined ? (
          <button
            onClick={handleJoinDAO}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold transition-all"
          >
            Join DAO
          </button>
        ) : (
          <div className="px-6 py-3 rounded-xl bg-green-600/20 border border-green-500/50 text-green-300 font-semibold">
            ✓ Joined
          </div>
        )}
        
        {/* NEW CONTRIBUTE BUTTON */}
        <button
          onClick={() => setShowContributeModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all"
        >
          💰 Contribute
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Tabs */}
      <div className="border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-3 border-b-2 transition-all ${
                activeTab === 'feed'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-purple-300 hover:text-white'
              }`}
            >
              Question Feed
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 border-b-2 transition-all ${
                activeTab === 'members'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-purple-300 hover:text-white'
              }`}
            >
              Members
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' ? (
          <div>
            {/* Ask AI Button */}
            <div className="mb-6">
              <button
                onClick={handleAskAI}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all"
              >
                🤖 Ask AI Tutor a Question
              </button>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <button className="w-8 h-8 rounded-lg bg-purple-600/50 hover:bg-purple-600 flex items-center justify-center text-white transition-all">
                        ▲
                      </button>
                      <div className="text-white font-semibold">{q.upvotes}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm text-purple-300 mb-2">
                        {q.askedBy} • {new Date(q.timestamp).toLocaleString()}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">{q.question}</h3>
                      <p className="text-gray-300 text-sm">{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member, idx) => (
              <div
                key={idx}
                className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {member.address[0]}
                  </div>
                  <div>
                    <div className="text-white font-mono">{member.address}</div>
                    <div className="text-xs text-purple-300">Joined {member.joinedAt}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{member.contributionScore}</div>
                  <div className="text-xs text-purple-300">Contribution Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Contribute Modal */}
{showContributeModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500">
      <h2 className="text-3xl font-bold text-white mb-4">Contribute to DAO</h2>
      
      <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-6">
        <div className="text-sm text-blue-300 mb-2">💡 How it works</div>
        <div className="text-white text-sm">
          1 SOL = 100 AI credits<br/>
          Each question costs 1 credit (0.01 SOL)
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm text-purple-300 mb-2">Amount (SOL)</label>
        <input
          type="number"
          step="0.1"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          placeholder="0.5"
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
        {contributionAmount && (
          <div className="text-sm text-green-400 mt-2">
            = {Math.floor(parseFloat(contributionAmount) * 100)} AI credits
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleContribute}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all"
        >
          Contribute
        </button>
        <button
          onClick={() => {
            setShowContributeModal(false);
            setContributionAmount('');
          }}
          className="flex-1 px-6 py-3 bg-purple-600/50 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}