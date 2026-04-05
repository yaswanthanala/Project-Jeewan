'use client';

import { Heart, Award, Users, Calendar, BookHeart, ClipboardList, MessageCircle, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function VolunteerPage() {
  const volunteer = {
    name: 'Meera Reddy',
    role: 'Community Volunteer',
    joinedDate: 'Jan 2025',
    totalHours: 48,
    storiesShared: 3,
    sessionsAssisted: 12,
    reportsFilied: 7,
    points: 1240,
    badges: 2,
  };

  const badges = [
    { name: 'First Responder', desc: 'Assisted 5+ sessions', earned: true, icon: '🛡️' },
    { name: 'Story Teller', desc: 'Shared 3 recovery stories', earned: true, icon: '📣' },
    { name: 'Guardian', desc: 'Filed 10+ anonymous reports', earned: false, icon: '🏅' },
    { name: 'Mentor', desc: '100+ volunteer hours', earned: false, icon: '🌟' },
  ];

  const upcomingDrives = [
    { name: 'Campus Anti-Drug Rally', institution: 'NIT AP', date: 'Apr 10, 2025', role: 'Lead Volunteer' },
    { name: 'Community Screening', institution: 'Vizag NGO', date: 'Apr 18, 2025', role: 'Coordinator' },
  ];

  const recentActivity = [
    { action: 'Assisted counselling session', time: '2 hours ago', icon: MessageCircle },
    { action: 'Shared a survivor story', time: '1 day ago', icon: BookHeart },
    { action: 'Filed an anonymous report', time: '3 days ago', icon: ClipboardList },
    { action: 'Completed DAST-10 quiz', time: '5 days ago', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-jeewan-warn" />
              <span className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Volunteer Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome, {volunteer.name} 🙌</h1>
            <p className="text-sm text-jeewan-muted mt-1">{volunteer.role} · Since {volunteer.joinedDate}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-jeewan-amber" />
              <span className="text-2xl font-bold text-jeewan-amber">{volunteer.points}</span>
            </div>
            <p className="text-[10px] text-jeewan-muted">Volunteer Points</p>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { value: `${volunteer.totalHours}h`, label: 'Volunteer hours', color: 'text-jeewan-calm', bg: 'bg-jeewan-calm-light' },
            { value: volunteer.sessionsAssisted, label: 'Sessions assisted', color: 'text-jeewan-nature', bg: 'bg-jeewan-nature-light' },
            { value: volunteer.storiesShared, label: 'Stories shared', color: 'text-jeewan-amber', bg: 'bg-jeewan-amber-light' },
            { value: volunteer.reportsFilied, label: 'Reports filed', color: 'text-jeewan-warn', bg: 'bg-jeewan-warn-light' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-[10px] text-jeewan-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-jeewan-amber" />
            <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Volunteer Badges</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.map((badge, i) => (
              <div key={i} className={`rounded-xl p-4 text-center border ${badge.earned ? 'bg-jeewan-amber-light border-jeewan-amber/30' : 'bg-jeewan-surface dark:bg-muted border-border opacity-50'}`}>
                <div className="text-2xl mb-1.5">{badge.icon}</div>
                <p className="text-xs font-bold text-foreground">{badge.name}</p>
                <p className="text-[10px] text-jeewan-muted mt-0.5">{badge.desc}</p>
                {!badge.earned && <p className="text-[9px] text-jeewan-muted mt-1">🔒 Locked</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Upcoming Drives */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-jeewan-nature" />
              <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Upcoming Drives</p>
            </div>
            <div className="space-y-2.5">
              {upcomingDrives.map((drive, i) => (
                <div key={i} className="p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                  <p className="text-sm font-bold text-foreground">{drive.name}</p>
                  <p className="text-[10px] text-jeewan-muted">{drive.institution} · {drive.date}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-jeewan-nature-light text-jeewan-nature rounded-lg text-[10px] font-bold">
                    {drive.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-jeewan-calm" />
              <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Recent Activity</p>
            </div>
            <div className="space-y-2.5">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                    <Icon className="w-4 h-4 text-jeewan-muted flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-[10px] text-jeewan-muted">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { href: '/stories', icon: BookHeart, label: 'Share a Story', desc: 'Help others by sharing', color: 'bg-jeewan-nature-light text-jeewan-nature' },
            { href: '/tipoff', icon: ClipboardList, label: 'File a Report', desc: 'Anonymous tip-off', color: 'bg-jeewan-warn-light text-jeewan-warn' },
            { href: '/chat', icon: MessageCircle, label: 'Assist a Session', desc: 'Support the chatbot', color: 'bg-jeewan-calm-light text-jeewan-calm' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} href={action.href} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-jeewan-calm transition group">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground group-hover:text-jeewan-calm transition">{action.label}</p>
                  <p className="text-[10px] text-jeewan-muted">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
