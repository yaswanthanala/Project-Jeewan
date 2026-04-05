'use client';

import { Building2, Users, Trophy, Target, CalendarCheck, TrendingUp, Award, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function InstitutionPage() {
  const institution = {
    name: 'NIT Andhra Pradesh',
    code: 'NIT-AP',
    coordinator: 'Dr. Ramesh Kumar',
    rank: 3,
    totalStudents: 842,
    activeStudents: 478,
    totalPoints: 98240,
    pledgeRate: 72,
    quizCompletion: 64,
  };

  const drives = [
    { name: 'Anti-Drug Week Rally', date: 'Mar 15, 2025', students: 320, status: 'completed' },
    { name: 'DAST-10 Screening Camp', date: 'Apr 5, 2025', students: 180, status: 'upcoming' },
    { name: 'Survivor Talk Series', date: 'Apr 20, 2025', students: 0, status: 'planned' },
  ];

  const topContributors = [
    { rank: 1, name: 'CSE Dept', points: 24800, students: 142 },
    { rank: 2, name: 'ECE Dept', points: 19600, students: 118 },
    { rank: 3, name: 'Mech Dept', points: 15400, students: 96 },
    { rank: 4, name: 'Civil Dept', points: 12200, students: 78 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-jeewan-calm" />
              <span className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Institution Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{institution.name}</h1>
            <p className="text-sm text-jeewan-muted mt-1">Coordinator: {institution.coordinator} · Code: {institution.code}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-jeewan-amber" />
              <span className="text-2xl font-bold text-jeewan-amber">#{institution.rank}</span>
            </div>
            <p className="text-[10px] text-jeewan-muted">National Rank</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { value: institution.totalStudents, label: 'Total students enrolled', color: 'text-jeewan-calm', bg: 'bg-jeewan-calm-light', icon: Users },
            { value: institution.activeStudents, label: 'Active this month', color: 'text-jeewan-nature', bg: 'bg-jeewan-nature-light', icon: TrendingUp },
            { value: `${institution.pledgeRate}%`, label: 'Daily pledge rate', color: 'text-jeewan-amber', bg: 'bg-jeewan-amber-light', icon: Target },
            { value: `${institution.quizCompletion}%`, label: 'Quiz completion', color: 'text-jeewan-warn', bg: 'bg-jeewan-warn-light', icon: BarChart3 },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`${stat.bg} rounded-xl p-4 text-center`}>
                <Icon className={`w-4 h-4 ${stat.color} mx-auto mb-1.5`} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-[10px] text-jeewan-muted mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Points Card */}
        <div className="bg-jeewan-calm rounded-xl text-white p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 mb-0.5">Total Institution Points</p>
              <p className="text-3xl font-bold">{institution.totalPoints.toLocaleString()}</p>
            </div>
            <Link href="/leaderboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition">
              View Leaderboard →
            </Link>
          </div>
        </div>

        {/* Department Rankings */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-3">Department-wise Rankings</p>
          <div className="space-y-2.5">
            {topContributors.map((dept) => (
              <div key={dept.rank} className="flex items-center justify-between p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-jeewan-calm-light text-jeewan-calm flex items-center justify-center text-xs font-bold">
                    #{dept.rank}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{dept.name}</p>
                    <p className="text-[10px] text-jeewan-muted">{dept.students} students · {dept.points.toLocaleString()} pts</p>
                  </div>
                </div>
                <div className="w-24 bg-jeewan-calm-light rounded-full h-2 overflow-hidden">
                  <div className="bg-jeewan-calm h-full rounded-full" style={{ width: `${(dept.points / topContributors[0].points) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awareness Drives */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Awareness Drives</p>
            <button className="px-3 py-1.5 bg-jeewan-nature text-white rounded-lg text-xs font-bold hover:bg-jeewan-nature/90 transition">
              + Schedule Drive
            </button>
          </div>
          <div className="space-y-2.5">
            {drives.map((drive, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-4 h-4 text-jeewan-muted" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{drive.name}</p>
                    <p className="text-[10px] text-jeewan-muted">{drive.date} · {drive.students > 0 ? `${drive.students} students` : 'TBD'}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  drive.status === 'completed' ? 'bg-jeewan-nature-light text-jeewan-nature' :
                  drive.status === 'upcoming' ? 'bg-jeewan-amber-light text-jeewan-amber' :
                  'bg-jeewan-calm-light text-jeewan-calm'
                }`}>
                  {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-jeewan-muted text-center mt-6">
          All data is anonymized — no individual student information is displayed. · FR-12, NFR-01
        </p>
      </div>
    </div>
  );
}
