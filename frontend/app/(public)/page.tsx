'use client';

import Link from 'next/link';
import { MessageCircle, MapPin, BookHeart, ClipboardList, Users, Shield, Phone, ArrowRight } from 'lucide-react';
import SOSButton from '@/components/SOSButton';
import { useLanguage } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useLanguage();
  const features = [
    {
      href: '/quiz',
      icon: ClipboardList,
      emoji: '📋',
      title: t('feat.quiz.title' as any),
      description: t('feat.quiz.desc' as any),
      color: 'bg-jeewan-calm-light text-jeewan-calm border-jeewan-calm/20',
      hoverColor: 'hover:border-jeewan-calm',
    },
    {
      href: '/chat',
      icon: MessageCircle,
      emoji: '💬',
      title: t('feat.chat.title' as any),
      description: t('feat.chat.desc' as any),
      color: 'bg-jeewan-nature-light text-jeewan-nature border-jeewan-nature/20',
      hoverColor: 'hover:border-jeewan-nature',
    },
    {
      href: '/maps',
      icon: MapPin,
      emoji: '🗺',
      title: t('feat.maps.title' as any),
      description: t('feat.maps.desc' as any),
      color: 'bg-jeewan-calm-light text-jeewan-calm border-jeewan-calm/20',
      hoverColor: 'hover:border-jeewan-calm',
    },
    {
      href: '/stories',
      icon: BookHeart,
      emoji: '📣',
      title: t('feat.stories.title' as any),
      description: t('feat.stories.desc' as any),
      color: 'bg-jeewan-nature-light text-jeewan-nature border-jeewan-nature/20',
      hoverColor: 'hover:border-jeewan-nature',
    },
    {
      href: '/ar',
      icon: BookHeart,
      emoji: '🪞',
      title: t('feat.ar.title' as any),
      description: t('feat.ar.desc' as any),
      color: 'bg-jeewan-warn-light text-jeewan-warn border-jeewan-warn/20',
      hoverColor: 'hover:border-jeewan-warn',
    },
    {
      href: '/tipoff',
      icon: BookHeart,
      emoji: '📍',
      title: t('feat.tipoff.title' as any),
      description: t('feat.tipoff.desc' as any),
      color: 'bg-jeewan-calm-light text-jeewan-calm border-jeewan-calm/20',
      hoverColor: 'hover:border-jeewan-calm',
    },
  ];

  const stats = [
    { number: t('stat.1.val' as any), label: t('stat.1.lbl' as any), color: 'text-jeewan-calm' },
    { number: t('stat.2.val' as any), label: t('stat.2.lbl' as any), color: 'text-jeewan-nature' },
    { number: t('stat.3.val' as any), label: t('stat.3.lbl' as any), color: 'text-jeewan-warn' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative bg-background border-b border-border overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          {/* SOS - Above the fold */}
          <div className="mb-10 max-w-md mx-auto">
            <SOSButton size="lg" />
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            {t('hero.title1')}<br />{t('hero.title2')} <span className="text-jeewan-calm">{t('hero.title3')}</span>
          </h1>
          <p className="text-base md:text-lg text-jeewan-muted mb-8 font-medium">
            {t('hero.subtitle')}
          </p>

          {/* Emergency Helpline */}
          <a
            href="tel:9152987821"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-jeewan-calm-mid text-jeewan-calm font-medium disabled:opacity-40 hover:bg-jeewan-calm hover:text-white transition-all text-sm"
          >
            <Phone className="w-4 h-4" />
            Helpline: 9152987821
          </a>
        </div>
      </section>

      {/* ── Quick Access Cards ── */}
      <section className="jeewan-section">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {features.map((feature, idx) => (
              <Link key={idx} href={feature.href}>
                <div className={`h-full p-4 md:p-5 rounded-2xl border ${feature.color} ${feature.hoverColor} hover:shadow-lg transition-all cursor-pointer group`}>
                  <div className="text-2xl mb-2">{feature.emoji}</div>
                  <h3 className="font-bold text-sm md:text-base mb-1">{feature.title}</h3>
                  <p className="text-xs text-jeewan-muted leading-snug">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-8 px-4 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.number}</p>
                <p className="text-xs text-jeewan-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="jeewan-section bg-jeewan-surface dark:bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center" style={{ fontFamily: "'Fraunces', serif" }}>
            {t('trust.title1' as any)} <span className="text-jeewan-calm">{t('trust.title2' as any)}</span> {t('trust.title3' as any)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🔒', title: t('trust.f1.t' as any), desc: t('trust.f1.d' as any) },
              { icon: '💸', title: t('trust.f2.t' as any), desc: t('trust.f2.d' as any) },
              { icon: '🤝', title: t('trust.f3.t' as any), desc: t('trust.f3.d' as any) },
              { icon: '🏥', title: t('trust.f4.t' as any), desc: t('trust.f4.d' as any) },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-card rounded-2xl border border-border hover:shadow-sm transition-shadow">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-jeewan-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-card border-y border-border py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('cta.title' as any)}
          </h2>
          <p className="text-jeewan-muted mb-8 text-sm md:text-base max-w-xl mx-auto">
            {t('cta.desc' as any)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-jeewan-calm text-white hover:bg-jeewan-calm/90 font-bold text-sm transition flex items-center justify-center gap-2">
              {t('cta.btn1' as any)}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/quiz" className="px-6 py-3 rounded-xl bg-card text-foreground hover:bg-muted font-bold text-sm transition border border-border flex items-center justify-center gap-2">
              {t('cta.btn2' as any)}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tip-Off Link ── */}
      <div className="text-center py-6 text-sm text-jeewan-muted">
        <Link href="/tipoff" className="hover:text-jeewan-calm transition inline-flex items-center gap-1.5">
          {t('footer.report' as any)}
        </Link>
        <span className="mx-2">·</span>
        <a href="#about" className="hover:text-jeewan-calm transition">{t('footer.about' as any)}</a>
      </div>
    </div>
  );
}
