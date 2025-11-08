'use client';

import { useEffect } from 'react';

interface Props {
  mintAddress: string;
  onClose: () => void;
}

export default function NFTMintSuccess({ mintAddress, onClose }: Props) {
  useEffect(() => {
    // Add CSS animation
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

    // Confetti effect
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
        confetti.textContent = ['🎉', '✨', '🏆', '⭐'][Math.floor(Math.random() * 4)];
        confetti.style.position = 'fixed';
        confetti.style.left = `${randomInRange(0, 100)}%`;
        confetti.style.top = `-20px`;
        confetti.style.fontSize = '24px';
        confetti.style.opacity = '1';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 3000);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      style.remove();
      // Clean up any remaining confetti
      document.querySelectorAll('.confetti-item').forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl animate-bounce-in">
        {/* NFT Badge Visual */}
        <div className="relative mb-6">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center transform rotate-3 shadow-xl">
            <div className="text-8xl">🏆</div>
          </div>
          <div className="absolute -top-4 -right-4 text-6xl animate-pulse">✨</div>
          <div className="absolute -bottom-4 -left-4 text-6xl animate-pulse">⭐</div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">🎉 NFT Minted!</h2>
          <p className="text-purple-200 text-lg mb-4">
            Your Proof-of-Knowledge badge is now on the Solana blockchain!
          </p>

          {/* Achievement Info */}
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <div className="text-sm text-purple-300 mb-1">Achievement</div>
            <div className="text-white font-bold">StudyDAO AI Learning Session</div>
          </div>

          {/* Mint Address */}
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <div className="text-xs text-purple-300 mb-1">Mint Address</div>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
