'use client';

import { Shield, Calendar, Users, AlertTriangle, CheckCircle, Clock, MessageCircle, Video, Phone } from 'lucide-react';
import { useState } from 'react';

export default function CounsellorDashboardPage() {
  const counsellor = {
    name: 'Dr. Priya Sharma',
    initials: 'PS',
    specialization: 'Clinical Psychologist',
    todaySessions: 4,
    pendingCases: 3,
    resolvedThisWeek: 12,
    rating: 4.9,
  };

  const [activeTab, setActiveTab] = useState<'upcoming' | 'flagged' | 'history'>('upcoming');

  const upcomingSessions = [
    { id: 1, patient: 'User #A291', time: 'Today, 4:00 PM', type: 'Video', status: 'confirmed', risk: 'moderate' },
    { id: 2, patient: 'User #B482', time: 'Today, 5:30 PM', type: 'Chat', status: 'confirmed', risk: 'low' },
    { id: 3, patient: 'User #C103', time: 'Tomorrow, 11:00 AM', type: 'Audio', status: 'pending', risk: 'high' },
    { id: 4, patient: 'User #D756', time: 'Tomorrow, 3:00 PM', type: 'Video', status: 'confirmed', risk: 'moderate' },
  ];

  const flaggedCases = [
    { id: 2847, source: 'DAST-10 Quiz', score: '9/10', college: 'NIT AP', time: '2 hours ago', priority: 'high' },
    { id: 2843, source: 'SOS Trigger', score: 'N/A', college: 'JNTU Kakinada', time: '5 hours ago', priority: 'critical' },
    { id: 2840, source: 'DAST-10 Quiz', score: '7/10', college: 'IIT Tirupati', time: '1 day ago', priority: 'moderate' },
  ];

  const sessionHistory = [
    { patient: 'User #E912', date: 'Apr 3, 2025', type: 'Video', duration: '45 min', notes: 'Follow-up on progress' },
    { patient: 'User #F301', date: 'Apr 2, 2025', type: 'Chat', duration: '30 min', notes: 'Initial assessment completed' },
    { patient: 'User #G487', date: 'Apr 1, 2025', type: 'Audio', duration: '60 min', notes: 'Referred to rehab centre' },
  ];

  const getTypeIcon = (type: string) => {
    if (type === 'Video') return <Video className="w-3.5 h-3.5" />;
    if (type === 'Audio') return <Phone className="w-3.5 h-3.5" />;
    return <MessageCircle className="w-3.5 h-3.5" />;
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'high' || risk === 'critical') return 'bg-jeewan-warn-light text-jeewan-warn';
    if (risk === 'moderate') return 'bg-jeewan-amber-light text-jeewan-amber';
    return 'bg-jeewan-nature-light text-jeewan-nature';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-jeewan-calm" />
              <span className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider">Counsellor Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{counsellor.name}</h1>
            <p className="text-sm text-jeewan-muted mt-1">{counsellor.specialization} · ⭐ {counsellor.rating}</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] bg-jeewan-calm-light text-jeewan-calm px-2.5 py-1 rounded-full font-medium">
            <Shield className="w-3 h-3" /> E2E Encrypted
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { value: counsellor.todaySessions, label: "Today's sessions", color: 'text-jeewan-calm', bg: 'bg-jeewan-calm-light', icon: Calendar },
            { value: counsellor.pendingCases, label: 'Pending flagged cases', color: 'text-jeewan-warn', bg: 'bg-jeewan-warn-light', icon: AlertTriangle },
            { value: counsellor.resolvedThisWeek, label: 'Resolved this week', color: 'text-jeewan-nature', bg: 'bg-jeewan-nature-light', icon: CheckCircle },
            { value: `${counsellor.rating}`, label: 'Patient rating', color: 'text-jeewan-amber', bg: 'bg-jeewan-amber-light', icon: Users },
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

        {/* Tabs */}
        <div className="flex gap-1 bg-jeewan-surface dark:bg-muted p-1 rounded-xl mb-4">
          {(['upcoming', 'flagged', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition ${
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-jeewan-muted hover:text-foreground'
              }`}
            >
              {tab === 'upcoming' ? `Upcoming (${upcomingSessions.length})` : tab === 'flagged' ? `Flagged Cases (${flaggedCases.length})` : 'Session History'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-xl p-5">
          {activeTab === 'upcoming' && (
            <div className="space-y-2.5">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-jeewan-calm-light text-jeewan-calm flex items-center justify-center">
                      {getTypeIcon(s.type)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{s.patient}</p>
                      <p className="text-[10px] text-jeewan-muted">{s.time} · {s.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${getRiskColor(s.risk)}`}>
                      {s.risk.toUpperCase()}
                    </span>
                    {s.status === 'confirmed' ? (
                      <button className="px-3 py-1.5 bg-jeewan-calm text-white rounded-lg text-[10px] font-bold hover:bg-jeewan-calm/90 transition">
                        Join
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-jeewan-amber-light text-jeewan-amber rounded-lg text-[10px] font-bold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'flagged' && (
            <div className="space-y-2.5">
              <p className="text-[10px] text-jeewan-muted mb-2">Anonymous high-risk cases auto-flagged by the system · No PII stored</p>
              {flaggedCases.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-foreground">Case #{c.id}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        c.priority === 'critical' ? 'bg-jeewan-warn text-white' : c.priority === 'high' ? 'bg-jeewan-warn-light text-jeewan-warn' : 'bg-jeewan-amber-light text-jeewan-amber'
                      }`}>
                        {c.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-jeewan-muted">{c.source} · Score: {c.score} · {c.college} · {c.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-jeewan-calm text-white rounded-lg text-[10px] font-bold hover:bg-jeewan-calm/90 transition">
                      Accept
                    </button>
                    <button className="px-3 py-1.5 border border-border text-foreground rounded-lg text-[10px] font-bold hover:bg-muted transition">
                      Refer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {sessionHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-jeewan-nature-light text-jeewan-nature flex items-center justify-center">
                      {getTypeIcon(h.type)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{h.patient}</p>
                      <p className="text-[10px] text-jeewan-muted">{h.date} · {h.type} · {h.duration}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-jeewan-muted max-w-[150px] text-right">{h.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] text-jeewan-muted text-center mt-6">
          All patient data is anonymized — No PII displayed · E2E Encrypted (AES-256) · FR-08, FR-09, NFR-02
        </p>
      </div>
    </div>
  );
}
