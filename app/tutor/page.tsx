'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import NFTMintSuccess from '@/components/NFTMintSuccess';
import { incrementStat, getUserStats, earnBadge } from '@/lib/stats';
import { checkBadgeEligibility, BADGE_TYPES } from '@/lib/badges';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI tutor powered by Google Gemini. Ask me anything about computer science, math, physics, or any topic you\'d like to learn!',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [pausedAudio, setPausedAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Solana wallet states
  const [walletAddress] = useState('34bRQivU8f8MMF5QuGMe7cxnsYtEjgWEBCdmManksCWa');
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const [showNFTModal, setShowNFTModal] = useState(false);
  const [mintedAddress, setMintedAddress] = useState('');
  const [daoCredits, setDaoCredits] = useState(999); 
  const [showLowCreditsWarning, setShowLowCreditsWarning] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // CHECK CREDITS BEFORE ASKING
    if (daoCredits <= 0) {
      setShowLowCreditsWarning(true);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: 'Student learning various subjects',
        }),
      });

      const data = await response.json();

      if (data.success) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // DEDUCT 1 CREDIT
      setDaoCredits(prev => prev - 1);
      
      // TRACK QUESTION ASKED
      incrementStat('questionsAsked', 1);
      
      // CHECK FOR NEW BADGES
      const stats = getUserStats();
      const newBadges: string[] = [];
      
      BADGE_TYPES.forEach(badge => {
        if (checkBadgeEligibility(badge.id, stats)) {
          const isNew = earnBadge(badge.id);
          if (isNew) {
            newBadges.push(badge.name);
          }
        }
      });
      
      // SHOW BADGE NOTIFICATION
      if (newBadges.length > 0) {
        setTimeout(() => {
          alert(`🎉 NEW BADGE EARNED!\n\n${newBadges[0]}\n\nCheck your Achievements page!`);
        }, 1500);
      }
      
      // Show warning if low
      if (daoCredits - 1 <= 10) {
        setTimeout(() => {
          alert(`⚠️ Low Credits!\n\nOnly ${daoCredits - 1} questions remaining.\nVisit your DAO to contribute more SOL!`);
        }, 1000);
      }
    } else {
      throw new Error(data.error);
    }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again!`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const playVoice = async (text: string) => {
    if (audioRef.current && pausedAudio) {
      await audioRef.current.play();
      setPlayingAudio(true);
      setPausedAudio(false);
      return;
    }

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Voice generation failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingAudio(false);
        setPausedAudio(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      setPlayingAudio(true);
      setPausedAudio(false);
    } catch (error: any) {
      console.error('Voice error:', error);
      setPlayingAudio(false);
      setPausedAudio(false);
      audioRef.current = null;
      alert(`Voice failed: ${error.message}`);
    }
  };

  const pauseVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudio(false);
      setPausedAudio(true);
    }
  };

  const mintNFT = async () => {
  if (!walletAddress) {
    alert('Please connect your wallet first!');
    return;
  }

  setMinting(true);
  setMintSuccess(false);

  try {
    const response = await fetch('/api/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        courseName: 'StudyDAO Achievement',
        topic: 'AI Learning Session',
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMintSuccess(true);
      setMintedAddress(data.mintAddress);
      setShowNFTModal(true); // Show fancy modal instead of alert!
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
            <div className="flex items-center gap-4">
              <Link
                href="/daos"
                className="px-4 py-2 text-purple-300 hover:text-white transition-all text-sm"
              >
                Browse DAOs
              </Link>
              <Link
                href="/achievements"
                className="px-3 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all text-sm"
              >
                🏆
              </Link>
              
              {/* Credits display */}
              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                daoCredits > 20 
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                  : daoCredits > 10
                  ? 'bg-yellow-600/20 border border-yellow-500/30 text-yellow-400'
                  : 'bg-red-600/20 border border-red-500/30 text-red-400'
              }`}>
                🤖 {daoCredits} credits
              </div>
              
              <div className="text-xs text-purple-300">
                💳 {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
              </div>
              <button
                onClick={mintNFT}
                disabled={minting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50 transition-all text-sm"
              >
                {minting ? '🔄 Minting...' : mintSuccess ? '✅ Minted!' : '🏆 Mint NFT'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-purple-900/40 border border-purple-500/30 text-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => {
                        if (!playingAudio && !pausedAudio) playVoice(msg.content);
                        else if (playingAudio) pauseVoice();
                        else if (pausedAudio) playVoice(msg.content);
                      }}
                      className="flex-shrink-0 p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all"
                      title={playingAudio ? "Pause" : pausedAudio ? "Resume" : "Play voice"}
                    >
                      {!playingAudio && !pausedAudio && '🔊'}
                      {playingAudio && '⏸️'}
                      {pausedAudio && '▶️'}
                    </button>
                  )}
                </div>
                <div className="text-xs opacity-60 mt-2" suppressHydrationWarning>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-purple-900/40 border border-purple-500/30 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Credits Meter */}
        <div className="mb-4 p-4 rounded-xl bg-slate-800/50 border border-purple-500/30">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-purple-300">AI Credits Remaining</div>
            <div className={`text-lg font-bold ${
              daoCredits > 20 ? 'text-blue-400' : daoCredits > 10 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {daoCredits} / 999
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                daoCredits > 20 ? 'bg-blue-500' : daoCredits > 10 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(daoCredits / 999) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Each question costs 1 credit • <Link href="/daos" className="text-purple-400 hover:text-purple-300">Contribute to DAO</Link>
          </div>
        </div>
        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything... (e.g., 'Explain binary search trees')"
            disabled={loading}
            className="flex-1 px-6 py-4 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
      {/* Low Credits Warning */}
      {showLowCreditsWarning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-900 to-slate-900 rounded-3xl p-8 max-w-md w-full border-2 border-red-500">
            <div className="text-6xl text-center mb-4">⚠️</div>
            <h2 className="text-3xl font-bold text-white text-center mb-4">Out of Credits!</h2>
            <p className="text-gray-300 text-center mb-6">
              Your DAO has run out of AI credits. Contribute SOL to unlock more questions!
            </p>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="text-sm text-blue-300 mb-2">💡 How to get more credits</div>
              <div className="text-white text-sm">
                1. Visit your DAO page<br/>
                2. Click "Contribute"<br/>
                3. Add SOL (1 SOL = 100 credits)
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/daos"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all text-center"
              >
                Go to DAOs
              </Link>
              <button
                onClick={() => setShowLowCreditsWarning(false)}
                className="flex-1 px-6 py-3 bg-purple-600/50 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* NFT Success Modal */}
      {showNFTModal && (
        <NFTMintSuccess
          mintAddress={mintedAddress}
          onClose={() => setShowNFTModal(false)}
        />
      )}
    </div>
  );
}