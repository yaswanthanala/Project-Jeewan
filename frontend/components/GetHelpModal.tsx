import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, MapPin, Phone, X, Calendar, CheckCircle2 } from 'lucide-react';
import { riskAPI, getUser } from '@/lib/api';

interface GetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  score?: number;
  riskLevel?: string;
}

export default function GetHelpModal({ isOpen, onClose, score, riskLevel }: GetHelpModalProps) {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBookSession = async () => {
    setLoading(true);
    try {
      const user = getUser();
      await riskAPI.bookSession({
        user_id: user?.id || 'anonymous_demo',
        institution: user?.institution || 'Project Jeewan Demo',
        score: score || 'N/A',
        risk_level: riskLevel || 'high'
      });
      setBooked(true);
      setTimeout(() => {
        onClose();
        setBooked(false);
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl border border-border relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-jeewan-muted hover:text-foreground transition p-1 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>

        {booked ? (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-jeewan-nature/10 text-jeewan-nature rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Session Requested!</h2>
            <p className="text-sm text-jeewan-muted">A campus counsellor will reach out to you within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">You deserve support — and that&apos;s okay.</h2>
              <p className="text-sm text-jeewan-muted">Choose your preferred way to connect with us:</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBookSession}
                disabled={loading}
                className="flex items-center gap-3 w-full p-5 rounded-2xl bg-jeewan-calm text-white font-bold hover:bg-jeewan-calm/90 transition shadow-lg shadow-jeewan-calm/20 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-base">📅 Book a Session</p>
                  <p className="text-[10px] font-normal opacity-80 uppercase tracking-widest">Connect with a Campus Counsellor</p>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/chat"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-jeewan-warn/10 text-jeewan-warn hover:bg-jeewan-warn/20 transition group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold">AI Chat</span>
                </Link>

                <Link
                  href="/maps"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-jeewan-nature/10 text-jeewan-nature hover:bg-jeewan-nature/20 transition group"
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold">Find Maps</span>
                </Link>
              </div>

              <a
                href="tel:9152987821"
                className="flex items-center gap-3 w-full p-4 rounded-2xl border border-border text-foreground hover:bg-muted transition"
              >
                <Phone className="w-5 h-5 text-jeewan-muted" />
                <span className="text-xs">📞 Call Helpline: <strong>9152987821</strong></span>
              </a>
            </div>

            <p className="text-[10px] text-jeewan-muted text-center mt-6">
              All interactions are free, anonymous, and protected by end-to-end encryption.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
