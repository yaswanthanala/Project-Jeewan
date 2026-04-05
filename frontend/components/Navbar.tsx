'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Home, ClipboardList, MessageCircle, MapPin, BookHeart, Shield, AlertTriangle, Globe, User, LayoutDashboard, Trophy, CalendarCheck, Camera, Building2, Heart, Stethoscope, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Quiz', icon: ClipboardList },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/stories', label: 'Stories', icon: BookHeart },
  { href: '/maps', label: 'Map', icon: MapPin },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0d1117]/80 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 bg-jeewan-calm rounded-lg flex items-center justify-center transition-all">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground tracking-tight">JEE</span>
              <span className="font-bold text-lg text-jeewan-nature tracking-tight">WAN</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-jeewan-ink2 dark:text-jeewan-muted hover:bg-jeewan-calm-light dark:hover:bg-jeewan-calm-light hover:text-jeewan-calm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Toggle */}
            <button className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-jeewan-muted hover:bg-jeewan-surface dark:hover:bg-muted border border-border transition-all">
              <Globe className="w-3.5 h-3.5" />
              <span>EN</span>
            </button>

            {/* Auth Buttons — Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="max-w-[100px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-jeewan-warn hover:bg-jeewan-warn-light transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-jeewan-calm-light text-jeewan-calm hover:bg-jeewan-calm hover:text-white font-semibold text-sm transition-all"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* SOS Button - Always visible */}
            <Link
              href="/#sos"
              className="flex items-center gap-1.5 px-3 py-2 md:px-4 rounded-lg bg-jeewan-warn text-white font-medium text-sm hover:bg-jeewan-warn/90 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              SOS
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1 pt-2 border-t border-border">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-jeewan-calm-light dark:hover:bg-jeewan-calm-light hover:text-jeewan-calm transition font-medium text-base"
                  >
                    <Icon className="w-5 h-5 text-jeewan-muted" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-border space-y-1 px-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <LayoutDashboard className="w-5 h-5 text-jeewan-muted" /> Dashboard
                </Link>
                <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <Trophy className="w-5 h-5 text-jeewan-muted" /> Leaderboard
                </Link>
                <Link href="/counsellor" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <CalendarCheck className="w-5 h-5 text-jeewan-muted" /> Counsellor Booking
                </Link>
                <Link href="/counsellor-dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <Stethoscope className="w-5 h-5 text-jeewan-muted" /> Counsellor Dashboard
                </Link>
                <Link href="/ar" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <Camera className="w-5 h-5 text-jeewan-muted" /> AR Simulation
                </Link>
                <Link href="/institution" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <Building2 className="w-5 h-5 text-jeewan-muted" /> Institution Dashboard
                </Link>
                <Link href="/volunteer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition font-medium">
                  <Heart className="w-5 h-5 text-jeewan-muted" /> Volunteer Dashboard
                </Link>
                <Link
                  href="/tipoff"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-jeewan-nature-light hover:text-jeewan-nature transition font-medium"
                >
                  <AlertTriangle className="w-5 h-5 text-jeewan-muted" />
                  Report Drug Activity
                </Link>

                {/* Mobile Auth Button */}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-jeewan-warn/10 text-jeewan-warn font-bold text-base transition hover:bg-jeewan-warn/20 mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout ({user.displayName || user.email?.split('@')[0]})
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-jeewan-calm text-white font-bold text-base transition hover:bg-jeewan-calm/90 mt-2"
                  >
                    <User className="w-5 h-5" />
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
