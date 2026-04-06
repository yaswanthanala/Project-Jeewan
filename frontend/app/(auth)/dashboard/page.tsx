'use client';

import Link from 'next/link';
import PledgeButton from '@/components/PledgeButton';
import BadgeCard from '@/components/BadgeCard';
import { TrendingUp, Award, Target, MessageCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { gameAPI, getUser } from '@/lib/api';

export default function DashboardPage() {
  const savedUser = getUser();
  const [user, setUser] = useState({
    name: savedUser?.name || 'User',
    streak: 0,
    totalPoints: 0,
    badges: 0,
  });

  const [badges, setBadges] = useState([
    { icon: '🏅', title: 'Awareness', description: 'Completed first quiz', isEarned: false, earnedDate: '2024-01-15' },
    { icon: '🔥', title: '14-day', description: 'Daily pledge for 14 days', isEarned: false, earnedDate: '2024-01-28' },
    { icon: '💬', title: 'Chat Champ', description: 'Had 5 counselling chats', isEarned: false, earnedDate: '2024-02-01' },
    { icon: '🏆', title: '30-day', description: 'Drug-Free Ambassador', isEarned: false },
    { icon: '📚', title: 'Story Reader', description: 'Read 5+ stories', isEarned: false },
    { icon: '🌟', title: 'Recovery Star', description: 'Help 3 others', isEarned: false },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [streakData, badgeData] = await Promise.all([
          gameAPI.getStreak(savedUser?.id),
          gameAPI.getBadges(savedUser?.id),
        ]);
        if (streakData) setUser(prev => ({ ...prev, streak: streakData.streak || 0 }));
        if (badgeData?.badges?.length) setUser(prev => ({ ...prev, badges: badgeData.count || 0 }));
      } catch {}
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, {user.name} 👋</h1>
            <p className="text-sm text-jeewan-muted mt-1">Keep going — you&apos;re doing amazing.</p>
          </div>
          <span className="text-sm font-bold text-jeewan-warn">🔥 {user.streak} day streak!</span>
        </div>

        {/* Pledge Card - Gradient */}
        <div className="bg-jeewan-calm rounded-xl text-white p-6 md:p-8 mb-6 border border-border">
          <p className="text-sm opacity-80 mb-1">Today&apos;s pledge</p>
          <h2 className="text-lg md:text-xl font-bold mb-4">&quot;I choose a drug-free life today.&quot;</h2>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {[1,2,3,4,5,6,7].map((d) => (
                <div key={d} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  d <= 3 ? 'bg-white/90 text-jeewan-nature' : 'bg-white/20 border border-white/30'
                }`}>
                  {d <= 3 ? '✓' : ''}
                </div>
              ))}
              <span className="text-[10px] opacity-60 self-center ml-1">this week</span>
            </div>
            <PledgeButton userId="arjun@example.com" initialStreak={user.streak} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: user.streak, label: 'Day Streak 🔥', color: 'text-jeewan-calm', bg: 'bg-jeewan-calm-light' },
            { value: user.badges, label: 'Badges Earned', color: 'text-jeewan-nature', bg: 'bg-jeewan-nature-light' },
            { value: user.totalPoints, label: 'Points', color: 'text-jeewan-amber', bg: 'bg-jeewan-amber-light' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-[10px] text-jeewan-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Your Badges</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {badges.map((badge, idx) => (
              <BadgeCard key={idx} {...badge} />
            ))}
          </div>
        </div>

        {/* Next Session */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-jeewan-calm" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Next session</h3>
              <p className="text-xs text-jeewan-muted">Dr. Priya Sharma · Thu 4:00 PM · Video</p>
            </div>
          </div>
          <Link href="/counsellor" className="px-4 py-1.5 bg-jeewan-calm-light text-jeewan-calm rounded-full text-xs font-bold hover:bg-jeewan-calm hover:text-white transition">
            Join
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { href: '/quiz', icon: Target, label: 'Take Quiz', desc: 'Test your knowledge', gradient: 'from-jeewan-calm/10' },
            { href: '/chat', icon: MessageCircle, label: 'Chat Support', desc: 'Talk to AI counsellor', gradient: 'from-jeewan-nature/10' },
            { href: '/maps', icon: MapPin, label: 'Find Rehab', desc: 'Nearest centres', gradient: 'from-jeewan-warn/10' },
            { href: '/ar', icon: Target, label: 'AR Simulation', desc: 'See drug effects', gradient: 'from-jeewan-amber/10' },
            { href: '/leaderboard', icon: Award, label: 'Leaderboard', desc: 'Institution rankings', gradient: 'from-jeewan-calm/10' },
            { href: '/stories', icon: MessageCircle, label: 'Stories', desc: 'Recovery journeys', gradient: 'from-jeewan-nature/10' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} href={action.href} className={`bg-gradient-to-br ${action.gradient} to-transparent bg-card border border-border rounded-2xl p-4 hover:shadow-md transition group`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-card border border-border rounded-xl group-hover:bg-jeewan-calm group-hover:text-white group-hover:border-jeewan-calm transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{action.label}</h3>
                    <p className="text-[10px] text-jeewan-muted">{action.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
