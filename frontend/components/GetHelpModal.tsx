'use client';

import Link from 'next/link';
import { MessageCircle, MapPin, Phone, X } from 'lucide-react';

interface GetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetHelpModal({ isOpen, onClose }: GetHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-sm border border-border relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-jeewan-muted hover:text-foreground transition">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">You may need support — and that&apos;s okay.</h2>
          <p className="text-sm text-jeewan-muted">Here are some ways we can help you right now:</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/chat"
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-jeewan-warn text-white font-bold hover:bg-jeewan-warn/90 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>💬 Chat with AI Counsellor now</span>
          </Link>

          <Link
            href="/maps"
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-jeewan-calm-light text-jeewan-calm font-bold hover:bg-jeewan-calm hover:text-white transition"
          >
            <MapPin className="w-5 h-5" />
            <span>🗺 Find nearest Rehab Centre</span>
          </Link>

          <a
            href="tel:9152987821"
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-jeewan-surface dark:bg-muted text-foreground hover:bg-muted transition"
          >
            <Phone className="w-5 h-5 text-jeewan-muted" />
            <span className="text-sm">📞 Call iCall helpline: <strong>9152987821</strong></span>
          </a>
        </div>

        <p className="text-xs text-jeewan-muted text-center mt-4">
          All options are free and confidential. You&apos;re not alone.
        </p>
      </div>
    </div>
  );
}
