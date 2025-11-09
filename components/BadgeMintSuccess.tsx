'use client';

import { useEffect } from 'react';
import { Badge } from '@/lib/badges';

interface Props {
  badge: Badge;
  mintAddress: string;
  onClose: () => void;
}

export default function BadgeMintSuccess({ badge, mintAddress, onClose }: Props) {
  useEffect(() => {
    // Confetti effect
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
      .confetti-item {
        animation: confetti-fall 3s linear forwards;
      }
    `;
    document.head.appendChild(style);

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 10;

      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-item';
        confetti.textContent = ['🎉', '✨', '🏆', '⭐', badge.icon][Math.floor(Math.random() * 5)];
        confetti.style.position = 'fixed';
        confetti.style.left = `${randomInRange(0, 100)}%`;
        confetti.style.top = `-20px`;
        confetti.style.fontSize = '24px';
        confetti.style.opacity = '1';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      style.remove();
      document.querySelectorAll('.confetti-item').forEach((el) => el.remove());
    };
  }, [badge.icon]);

  const getRarityColor = () => {
    switch (badge.rarity) {
      case 'common':
        return 'border-gray-400';
      case 'rare':
        return 'border-blue-400';
      case 'epic':
        return 'border-purple-400';
      case 'legendary':
        return 'border-yellow-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl animate-bounce-in">
        {/* Badge Visual */}
        <div className="relative mb-6">
          <div
            className={`w-48 h-48 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center transform rotate-3 shadow-xl border-4 ${getRarityColor()}`}
          >
            <div className="text-8xl">{badge.icon}</div>
          </div>
          <div className="absolute -top-4 -right-4 text-6xl animate-pulse">✨</div>
          <div className="absolute -bottom-4 -left-4 text-6xl animate-pulse">⭐</div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <div className="text-sm text-purple-300 uppercase font-bold mb-2">{badge.rarity} Badge</div>
          <h2 className="text-4xl font-bold text-white mb-2">{badge.name}</h2>
          <p className="text-purple-200 text-lg mb-4">{badge.description}</p>

          <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-3 mb-4">
            <div className="text-green-300 font-semibold">✓ Minted on Solana Blockchain!</div>
          </div>

          {/* Mint Address */}
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-xs text-purple-300 mb-1">NFT Address</div>
            <div className="text-white text-xs font-mono break-all">{mintAddress}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all text-center"
          >
            🔍 View on Explorer
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-purple-600/50 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
