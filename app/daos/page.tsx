'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { incrementStat } from '@/lib/stats'; 

interface DAO {
  id: string;
  name: string;
  subject: string;
  description: string;
  memberCount: number;
  treasuryBalance: number;
  aiCredits: number; 
  createdAt: string;
}

export default function DAOsPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  
  const [daos, setDaos] = useState<DAO[]>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('studydao-daos');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return [
    {
      id: 'cs229-ml',
      name: 'CS229 Machine Learning',
      subject: 'Computer Science',
      description: 'Study group for Stanford CS229 - Machine Learning course',
      memberCount: 12,
      treasuryBalance: 2.5,
      aiCredits: 250, // NEW!
      createdAt: new Date().toISOString(),
    },
    {
      id: 'calc-3',
      name: 'Calculus III Study Group',
      subject: 'Mathematics',
      description: 'Multivariable calculus and vector analysis',
      memberCount: 8,
      treasuryBalance: 1.2,
      aiCredits: 120, // NEW!
      createdAt: new Date().toISOString(),
    },
    {
      id: 'physics-2',
      name: 'Physics 2 E&M',
      subject: 'Physics',
      description: 'Electricity and Magnetism study sessions',
      memberCount: 15,
      treasuryBalance: 3.0,
      aiCredits: 300, // NEW!
      createdAt: new Date().toISOString(),
    },
  ];
});

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
  });

  // Save to localStorage whenever daos change
    useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('studydao-daos', JSON.stringify(daos));
  }
}, [daos]);

  const handleCreateDAO = async () => {
    if (!formData.name || !formData.subject) {
      alert('Please fill in all required fields!');
      return;
    }

  setCreating(true);

  const newDAO: DAO = {
    id: formData.name.toLowerCase().replace(/\s+/g, '-'),
    name: formData.name,
    subject: formData.subject,
    description: formData.description,
    memberCount: 1,
    treasuryBalance: 0,
    aiCredits: 0,
    createdAt: new Date().toISOString(),
  };

  setDaos([newDAO, ...daos]);
  setShowCreateModal(false);
  setFormData({ name: '', subject: '', description: '' });
  setCreating(false);

  // TRACK DAO CREATION
  incrementStat('daosCreated', 1);

  alert(`🎉 DAO Created!\n\nYour "${formData.name}" study group is now live!\n\n💡 Tip: Contribute SOL to unlock AI credits!\n\n🏆 Check your Achievements - you may have earned a badge!`);
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
              <Link
                href="/tutor"
                className="px-4 py-2 text-purple-300 hover:text-white transition-all"
              >
                AI Tutor
              </Link>
              <Link
                href="/daos"
                className="px-4 py-2 text-white font-semibold"
              >
                DAOs
              </Link>
              <Link
                href="/achievements"
                className="px-4 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all"
              >
                🏆 Achievements
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Study DAOs</h1>
            <p className="text-purple-300">Join collaborative learning groups powered by blockchain</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold transition-all transform hover:scale-105"
          >
            + Create DAO
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">{daos.length}</div>
            <div className="text-sm text-purple-300">Active DAOs</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">
              {daos.reduce((sum, dao) => sum + dao.memberCount, 0)}
            </div>
            <div className="text-sm text-purple-300">Total Members</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">
              {daos.reduce((sum, dao) => sum + dao.treasuryBalance, 0).toFixed(1)} SOL
            </div>
            <div className="text-sm text-purple-300">Total Treasury</div>
          </div>
        </div>

        {/* DAO Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daos.map((dao) => (
              <Link
                key={dao.id}
                href={`/dao/${dao.id}`}
                className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    📚
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-purple-600/50 text-purple-200">
                    {dao.subject}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{dao.name}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{dao.description}</p>
                
                {/* ADD THIS CREDITS DISPLAY */}
                <div className="mb-3 px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
                  <div className="text-xs text-blue-300 mb-1">AI Credits Available</div>
                  <div className="text-lg font-bold text-blue-400">
                    🤖 {dao.aiCredits} questions
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className="text-purple-300">
                    👥 {dao.memberCount} members
                  </div>
                  <div className="text-green-400">
                    💰 {dao.treasuryBalance.toFixed(1)} SOL
                  </div>
                </div>
              </Link>
            ))}
          </div>
      </div>

      {/* Create DAO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500">
            <h2 className="text-3xl font-bold text-white mb-6">Create Study DAO</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2">DAO Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="CS229 Machine Learning"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-300 mb-2">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select subject...</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Economics">Economics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-purple-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will your study group focus on?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateDAO}
                disabled={creating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create DAO'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
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