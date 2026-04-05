'use client';

import { useState } from 'react';
import { Shield, Star, Calendar } from 'lucide-react';

interface Counsellor {
  id: string;
  name: string;
  initials: string;
  specialization: string;
  experience: number;
  rating: number;
  languages: string[];
  sessionTypes: ('Video' | 'Audio' | 'Chat')[];
  slots: string[];
}

const COUNSELLORS: Counsellor[] = [
  { id: '1', name: 'Dr. Priya Sharma', initials: 'PS', specialization: 'Clinical Psychologist · 8 yrs exp', experience: 8, rating: 4.9, languages: ['Hindi', 'English'], sessionTypes: ['Video', 'Audio', 'Chat'], slots: ['Thu 4pm', 'Fri 11am', 'Sat 3pm'] },
  { id: '2', name: 'Rajesh Kumar', initials: 'RK', specialization: 'Recovery Coach · 6 yrs exp', experience: 6, rating: 4.8, languages: ['Hindi', 'English', 'Marathi'], sessionTypes: ['Video', 'Audio', 'Chat'], slots: ['Mon 2pm', 'Wed 10am'] },
  { id: '3', name: 'Dr. Aisha Patel', initials: 'AP', specialization: 'Addiction Specialist · 10 yrs exp', experience: 10, rating: 4.7, languages: ['English', 'Hindi', 'Gujarati'], sessionTypes: ['Video', 'Audio'], slots: ['Tue 5pm', 'Thu 11am', 'Sat 9am'] },
];

export default function CounsellorPage() {
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleBook = () => {
    if (selectedCounsellor && selectedSession && selectedSlot) {
      alert(`Booking confirmed with ${selectedCounsellor.name} for ${selectedSession} session on ${selectedSlot}`);
      setSelectedCounsellor(null);
      setSelectedSession(null);
      setSelectedSlot(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-7 h-7 text-jeewan-calm" />
              Book a Session
            </h1>
            <p className="text-sm text-jeewan-muted mt-1">Connect with experienced professionals.</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] bg-jeewan-calm-light text-jeewan-calm px-2.5 py-1 rounded-full font-medium">
            <Shield className="w-3 h-3" /> E2E Encrypted
          </span>
        </div>

        {/* Counsellor Cards */}
        <div className="space-y-4">
          {COUNSELLORS.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-jeewan-calm flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground">{c.name}</h3>
                  <p className="text-xs text-jeewan-muted">{c.specialization}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-jeewan-amber">
                  <Star className="w-3.5 h-3.5 fill-jeewan-amber" /> {c.rating}
                </div>
              </div>

              {/* Session Types & Languages */}
              <div className="flex gap-2 flex-wrap mb-3">
                {c.sessionTypes.map((type) => (
                  <span key={type} className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                    type === 'Video' ? 'bg-jeewan-calm-light text-jeewan-calm' : type === 'Audio' ? 'bg-jeewan-nature-light text-jeewan-nature' : 'bg-muted text-jeewan-muted'
                  }`}>
                    {type === 'Video' ? '📹' : type === 'Audio' ? '☎️' : '💬'} {type}
                  </span>
                ))}
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-muted text-jeewan-muted">
                  {c.languages.join(', ')}
                </span>
              </div>

              {/* Time Slots */}
              <div className="flex gap-2 flex-wrap">
                {c.slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => { setSelectedCounsellor(c); setSelectedSlot(slot); }}
                    className="px-3 py-1.5 rounded-lg border border-jeewan-calm-mid text-jeewan-calm text-xs font-medium hover:bg-jeewan-calm hover:text-white transition"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedCounsellor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-float-up">
              <h2 className="text-lg font-bold text-foreground mb-1">{selectedCounsellor.name}</h2>
              <p className="text-xs text-jeewan-muted mb-4">{selectedCounsellor.specialization} · {selectedSlot}</p>

              <p className="text-xs font-bold text-foreground mb-2">Choose session type:</p>
              <div className="flex gap-2 mb-5">
                {selectedCounsellor.sessionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSession(type)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      selectedSession === type ? 'bg-jeewan-calm text-white' : 'bg-muted text-jeewan-muted hover:bg-jeewan-calm-light hover:text-jeewan-calm'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedCounsellor(null)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition">Cancel</button>
                <button onClick={handleBook} disabled={!selectedSession} className="flex-1 py-2.5 rounded-xl bg-jeewan-calm text-white font-bold text-sm hover:bg-jeewan-calm/90 transition disabled:opacity-40">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
