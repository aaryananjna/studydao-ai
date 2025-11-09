'use client';

import Link from 'next/link';



export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                StudyDAO
              </h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/daos"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all"
              >
                Browse DAOs
              </Link>
              <Link
                href="/tutor"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all"
              >
                AI Tutor
              </Link>
              <Link
                href="/achievements"
                className="px-4 py-2 rounded-lg border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition-all"
              >
                🏆 Achievements
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Learn Together,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Earn Together
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            AI-powered tutoring with voice responses and blockchain-verified credentials. 
            Join Study DAOs and earn Proof-of-Knowledge NFTs on Solana.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/tutor"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="p-8 rounded-xl bg-purple-900/20 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-3">AI Tutor</h3>
            <p className="text-gray-300">
              Powered by Google Gemini, get personalized explanations for any topic.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-blue-900/20 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Voice Learning</h3>
            <p className="text-gray-300">
              Listen to explanations with natural voice powered by ElevenLabs.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-pink-900/20 border border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-3">NFT Credentials</h3>
            <p className="text-gray-300">
              Earn verifiable Proof-of-Knowledge NFTs on Solana blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}