'use client';

import { useState, useEffect } from 'react';
import { gameAPI } from '@/lib/api';

interface LeaderboardEntry {
  rank: number;
  name?: string;
  institution?: string;
  students?: number;
  points: number;
  badge?: string;
  change?: string;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'NIT Andhra Pradesh', students: 842, points: 98240, badge: '🥇', change: '↑ 1' },
  { rank: 2, name: 'IIT Tirupati', students: 621, points: 74500, badge: '🥈', change: '—' },
  { rank: 3, name: 'JNTU Kakinada', students: 510, points: 62100, badge: '🥉', change: '↑ 2' },
  { rank: 4, name: 'Andhra University', students: 489, points: 58900 },
  { rank: 5, name: 'SRM AP', students: 378, points: 45200 },
  { rank: 6, name: 'VIT AP', students: 342, points: 41800 },
];

const USER_COLLEGE = { rank: 7, name: 'Your College', students: 234, points: 28400 };

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await gameAPI.getLeaderboard();
        if (data?.leaderboard?.length) {
          const badges = ['🥇', '🥈', '🥉'];
          setLeaderboard(data.leaderboard.map((entry: any, i: number) => ({
            rank: entry.rank,
            name: entry.institution,
            points: entry.points,
            badge: badges[i] || undefined,
          })));
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchLeaderboard();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">🏆 Institution Rankings</h1>
          <p className="text-sm text-jeewan-muted">Pledge + Quiz scores count · Updated every 5 minutes</p>
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-jeewan-amber-light text-jeewan-amber rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-jeewan-amber animate-pulse" /> Live
          </span>
        </div>

        {/* Rankings */}
        <div className="space-y-2.5 mb-4">
          {leaderboard.length === 0 ? (
            <div className="text-center py-10 bg-card border border-border rounded-2xl text-sm text-jeewan-muted">
              Live leaderboard is currently empty. Start taking pledges to rank!
            </div>
          ) : (
            leaderboard.map((inst: LeaderboardEntry) => (
              <div key={inst.rank} className={`flex items-center gap-3 p-4 rounded-2xl border transition ${
                inst.rank === 1 ? 'bg-gradient-to-r from-jeewan-amber-light to-white dark:to-card border-[#FAC775]' : 'bg-card border-border'
              }`}>
                <div className="text-xl font-bold w-8 text-center">{inst.badge || `#${inst.rank}`}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground truncate">{inst.name}</h3>
                  <p className="text-[10px] text-jeewan-muted">{inst.students} students · {inst.points.toLocaleString()} pts</p>
                </div>
                {inst.change && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inst.change.includes('↑') ? 'bg-jeewan-nature-light text-jeewan-nature' : 'bg-muted text-jeewan-muted'
                  }`}>
                    {inst.change}
                  </span>
                )}
              </div>
            ))
          )}

          {/* Your College - Highlighted */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-jeewan-calm-light border-2 border-jeewan-calm-mid">
            <div className="text-sm font-bold w-8 text-center text-jeewan-calm">#{USER_COLLEGE.rank}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground">{USER_COLLEGE.name}</h3>
              <p className="text-[10px] text-jeewan-muted">{USER_COLLEGE.students} students · {USER_COLLEGE.points.toLocaleString()} pts</p>
            </div>
            <span className="text-[10px] font-bold text-jeewan-calm">You&apos;re here</span>
          </div>
        </div>

        <p className="text-[10px] text-jeewan-muted text-center">Updated every 5 minutes · Pledge + Quiz scores count</p>
      </div>
    </div>
  );
}
