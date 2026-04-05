'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, MessageCircle, User, AlertCircle } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/quiz', icon: ClipboardList, label: 'Quiz' },
  // SOS is in the center (handled separately)
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/dashboard', icon: User, label: 'Me' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Bottom Navigation - Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#161b22]/95 glass border-t border-border z-50">
        <div className="flex justify-around items-center h-16 px-1 relative">
          {/* Left items */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                  isActive
                    ? 'text-jeewan-calm'
                    : 'text-jeewan-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}

          {/* Center SOS Button - Raised */}
          <div className="flex flex-col items-center justify-center flex-1 -mt-5">
            <Link
              href="/#sos"
              className="w-14 h-14 bg-jeewan-warn rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-[#161b22] hover:bg-jeewan-warn/90 transition-colors"
            >
              <AlertCircle className="h-6 w-6 text-white" />
            </Link>
            <span className="text-[9px] font-bold text-jeewan-warn mt-0.5">SOS</span>
          </div>

          {/* Right items */}
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                  isActive
                    ? 'text-jeewan-calm'
                    : 'text-jeewan-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
