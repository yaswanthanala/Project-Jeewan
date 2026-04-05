'use client';

import { useState, useEffect } from 'react';
import { Heart, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PledgeButtonProps {
  userId?: string;
  initialStreak?: number;
  pledgeText?: string;
}

export default function PledgeButton({ 
  userId, 
  initialStreak = 0,
  pledgeText = "I pledge to stay strong and support my recovery journey"
}: PledgeButtonProps) {
  const [isPledged, setIsPledged] = useState(false);
  const [streak, setStreak] = useState(initialStreak);
  const [lastPledgeDate, setLastPledgeDate] = useState<string | null>(null);

  useEffect(() => {
    // Check if already pledged today
    const lastPledge = localStorage.getItem(`pledge_${userId || 'guest'}`);
    const today = new Date().toDateString();
    
    if (lastPledge === today) {
      setIsPledged(true);
    }
  }, [userId]);

  const handlePledge = async () => {
    setIsPledged(true);
    const today = new Date().toDateString();
    localStorage.setItem(`pledge_${userId || 'guest'}`, today);
    setLastPledgeDate(today);
    setStreak(streak + 1);

    // Optional: Send to backend
    if (userId) {
      try {
        await fetch('/api/pledge/daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, streak: streak + 1 }),
        });
      } catch (error) {
        console.error('[v0] Pledge error:', error);
      }
    }
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-jeewan-nature/10 to-jeewan-calm/10 border-2 border-jeewan-nature rounded-lg">
      <div className="text-center mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Daily Pledge</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{pledgeText}</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-jeewan-nature font-bold text-2xl">
            <Flame className="h-6 w-6" />
            {streak}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>
      </div>

      <Button
        onClick={handlePledge}
        disabled={isPledged}
        className={`w-full font-bold ${
          isPledged
            ? 'bg-jeewan-nature hover:bg-jeewan-nature/90'
            : 'bg-jeewan-calm hover:bg-jeewan-calm/90'
        } text-white`}
      >
        <Heart className={`h-5 w-5 mr-2 ${isPledged ? 'fill-white' : ''}`} />
        {isPledged ? 'Pledged Today' : 'Make Your Pledge'}
      </Button>

      {lastPledgeDate && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
          Last pledged: {lastPledgeDate}
        </p>
      )}
    </div>
  );
}
