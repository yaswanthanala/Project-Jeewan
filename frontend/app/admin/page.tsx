'use client';

export default function AdminPage() {
  const flaggedCases = [
    { id: 2847, detail: 'Quiz score: 9/10 · College: NIT AP', status: 'pending' },
    { id: 2846, detail: 'SOS triggered · Visakhapatnam', status: 'resolved' },
    { id: 2845, detail: 'Quiz score: 8/10 · College: JNTU', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">⚙️ Admin Panel</h1>
            <p className="text-sm text-jeewan-muted mt-1">NMBA-integrated analytics dashboard.</p>
          </div>
          <span className="text-[10px] bg-jeewan-amber-light text-jeewan-amber px-3 py-1 rounded-full font-bold">NMBA Integrated</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { value: 7, label: 'Flagged cases today', color: 'text-jeewan-warn', bg: 'bg-jeewan-warn-light' },
            { value: '1,240', label: 'Active users this week', color: 'text-jeewan-calm', bg: 'bg-jeewan-calm-light' },
            { value: 156, label: 'Quiz completions', color: 'text-jeewan-nature', bg: 'bg-jeewan-nature-light' },
            { value: 42, label: 'SOS triggers', color: 'text-jeewan-warn', bg: 'bg-jeewan-warn-light' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-[10px] text-jeewan-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* NMBA Trend */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-3">NMBA Trend — Andhra Pradesh</p>
          <div className="h-20 flex items-end gap-1.5 mb-2">
            {[60, 80, 50, 95, 70, 65, 75, 55, 85, 45, 90, 60].map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className={`rounded-t ${i === 3 || i === 10 ? 'bg-jeewan-warn' : 'bg-jeewan-calm/60'} transition-all`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-jeewan-muted">Spike detected in Oct & Mar — seasonal patterns</p>
        </div>

        {/* Flagged Cases */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-3">High-risk flagged cases (anonymous)</p>
          <div className="space-y-2.5">
            {flaggedCases.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-jeewan-surface dark:bg-muted rounded-xl">
                <div>
                  <span className="text-xs font-bold text-foreground">Case #{c.id}</span>
                  <span className="text-xs text-jeewan-muted ml-2">{c.detail}</span>
                </div>
                {c.status === 'pending' ? (
                  <button className="px-3 py-1 bg-jeewan-warn text-white rounded-lg text-[10px] font-bold hover:bg-jeewan-warn/90 transition">
                    Assign
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-jeewan-nature text-white rounded-lg text-[10px] font-bold">
                    Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
