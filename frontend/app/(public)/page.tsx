'use client';

import Link from 'next/link';
import { MessageCircle, MapPin, BookHeart, ClipboardList, Users, Shield, Phone, ArrowRight } from 'lucide-react';
import SOSButton from '@/components/SOSButton';

export default function HomePage() {
  const features = [
    {
      href: '/quiz',
      icon: ClipboardList,
      emoji: '📋',
      title: 'Check Your Risk',
      description: 'DAST-10 quiz · 2 min · Anonymous',
      color: 'bg-jeewan-calm-light text-jeewan-calm border-jeewan-calm/20',
      hoverColor: 'hover:border-jeewan-calm',
    },
    {
      href: '/chat',
      icon: MessageCircle,
      emoji: '💬',
      title: 'Talk to AI',
      description: 'No login · 24/7 chat · Private',
      color: 'bg-jeewan-nature-light text-jeewan-nature border-jeewan-nature/20',
      hoverColor: 'hover:border-jeewan-nature',
    },
    {
      href: '/maps',
      icon: MapPin,
      emoji: '🗺',
      title: 'Find Rehab',
      description: 'Nearest centres · GPS · Directions',
      color: 'bg-jeewan-calm-light text-jeewan-calm border-jeewan-calm/20',
      hoverColor: 'hover:border-jeewan-calm',
    },
    {
      href: '/stories',
      icon: BookHeart,
      emoji: '📣',
      title: 'Hear Stories',
      description: 'Real recovery voices · Inspiring',
      color: 'bg-jeewan-nature-light text-jeewan-nature border-jeewan-nature/20',
      hoverColor: 'hover:border-jeewan-nature',
    },
    {
      href: '/ar',
      icon: BookHeart,
      emoji: '🪞',
      title: 'AR Simulation',
      description: 'See drug effects on your face',
      color: 'bg-jeewan-warn-light text-jeewan-warn border-jeewan-warn/20',
      hoverColor: 'hover:border-jeewan-warn',
    },
    {
      href: '/tipoff',
      icon: BookHeart,
      emoji: '📍',
      title: 'Report Activity',
      description: 'Anonymous · No IP stored',
      color: 'bg-jeewan-calm-light text-jeewan-calm border-jeewan-calm/20',
      hoverColor: 'hover:border-jeewan-calm',
    },
  ];

  const stats = [
    { number: '1.2L+', label: 'Youth Helped', color: 'text-jeewan-calm' },
    { number: '320+', label: 'Rehab Centres', color: 'text-jeewan-nature' },
    { number: '24/7', label: 'Crisis Line', color: 'text-jeewan-warn' },
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
            You don&apos;t have to<br />face this <span className="text-jeewan-calm">alone</span>.
          </h1>
          <p className="text-base md:text-lg text-jeewan-muted mb-8 font-medium">
            Anonymous help · No judgment · Any time
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
            Why People <span className="text-jeewan-calm">Trust</span> JEEWAN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🔒', title: '100% Confidential', desc: 'Encrypted conversations. No data shared. Ever.' },
              { icon: '💸', title: 'Completely Free', desc: 'No hidden charges. All services at zero cost.' },
              { icon: '🤝', title: 'No Judgment', desc: 'We listen, support, and guide — without stigma.' },
              { icon: '🏥', title: 'Professional Help', desc: 'Certified counsellors and accredited rehab centres.' },
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
            Ready to Take the First Step?
          </h2>
          <p className="text-jeewan-muted mb-8 text-sm md:text-base max-w-xl mx-auto">
            Thousands have found help and recovered. You can too. Start whenever you&apos;re ready — we&apos;re available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-jeewan-calm text-white hover:bg-jeewan-calm/90 font-bold text-sm transition flex items-center justify-center gap-2">
              Create an Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/quiz" className="px-6 py-3 rounded-xl bg-card text-foreground hover:bg-muted font-bold text-sm transition border border-border flex items-center justify-center gap-2">
              Take Self Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tip-Off Link ── */}
      <div className="text-center py-6 text-sm text-jeewan-muted">
        <Link href="/tipoff" className="hover:text-jeewan-calm transition inline-flex items-center gap-1.5">
          📍 Report Drug Activity (anonymous)
        </Link>
        <span className="mx-2">·</span>
        <a href="#about" className="hover:text-jeewan-calm transition">About JEEWAN</a>
      </div>
    </div>
  );
}
