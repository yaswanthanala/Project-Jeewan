'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();
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
              {t('ft.tagline' as any)}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('ft.srv' as any)}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/quiz" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.srv.quiz' as any)}</Link></li>
              <li><Link href="/chat" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.srv.ai' as any)}</Link></li>
              <li><Link href="/maps" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.srv.map' as any)}</Link></li>
              <li><Link href="/stories" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.srv.stories' as any)}</Link></li>
              <li><Link href="/counsellor" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.srv.counsellor' as any)}</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('ft.info' as any)}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#privacy" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.info.privacy' as any)}</a></li>
              <li><a href="#terms" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.info.terms' as any)}</a></li>
              <li><a href="#about" className="text-white/50 hover:text-jeewan-nature transition">{t('ft.info.about' as any)}</a></li>
              <li>
                <Link href="/tipoff" className="flex items-center gap-1.5 text-white/50 hover:text-jeewan-nature transition">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t('ft.info.report' as any)}
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('ft.supp' as any)}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <Phone className="w-5 h-5 text-jeewan-warn flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{t('ft.supp.crisis' as any)}</p>
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
                <span className="text-sm text-white/50">{t('ft.supp.loc' as any)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            {t('ft.cpy' as any)}
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
          {t('ft.emg' as any)}
        </p>
      </div>
    </footer>
  );
}
