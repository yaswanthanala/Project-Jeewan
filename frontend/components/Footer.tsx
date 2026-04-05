'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Shield, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-jeewan-ink dark:bg-[#0d1117] text-white/70 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-jeewan-calm rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">JEE</span>
                <span className="font-bold text-lg text-jeewan-nature">WAN</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Join · Educate · Empower · Warn Against Narcotics. Free, confidential addiction support for all.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/quiz" className="text-white/50 hover:text-jeewan-nature transition">DAST-10 Quiz</Link></li>
              <li><Link href="/chat" className="text-white/50 hover:text-jeewan-nature transition">AI Chatbot</Link></li>
              <li><Link href="/maps" className="text-white/50 hover:text-jeewan-nature transition">Rehab Map</Link></li>
              <li><Link href="/stories" className="text-white/50 hover:text-jeewan-nature transition">Survivor Stories</Link></li>
              <li><Link href="/counsellor" className="text-white/50 hover:text-jeewan-nature transition">Counsellor Booking</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Information</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#privacy" className="text-white/50 hover:text-jeewan-nature transition">Privacy Policy</a></li>
              <li><a href="#terms" className="text-white/50 hover:text-jeewan-nature transition">Terms of Service</a></li>
              <li><a href="#about" className="text-white/50 hover:text-jeewan-nature transition">About JEEWAN</a></li>
              <li>
                <Link href="/tipoff" className="flex items-center gap-1.5 text-white/50 hover:text-jeewan-nature transition">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Report Drug Activity
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">24/7 Support</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <Phone className="w-5 h-5 text-jeewan-warn flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Crisis Helpline</p>
                  <a href="tel:9152987821" className="font-bold text-sm text-white hover:text-jeewan-nature transition">
                    9152987821 (iCall)
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-jeewan-calm flex-shrink-0" />
                <a href="mailto:help@jeewan.org" className="text-sm text-white/50 hover:text-jeewan-nature transition">
                  help@jeewan.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-jeewan-nature flex-shrink-0" />
                <span className="text-sm text-white/50">All 32 Indian states</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2025 JEEWAN. Helping Indians recover, one step at a time.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span>Next.js 15 · App Router</span>
            <span>PWA + Offline</span>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-jeewan-warn/10 border-t border-jeewan-warn/20 px-4 py-3 text-center">
        <p className="text-jeewan-warn font-bold text-sm">
          In crisis? Call <span className="text-base">112</span> or use the SOS button for immediate help
        </p>
      </div>
    </footer>
  );
}
