'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, FlaskConical, BookOpen, Activity } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/simulation', label: 'Perceptron', icon: FlaskConical },
  { href: '/mcp', label: 'MCP Lab', icon: Activity },
  { href: '/about', label: 'About', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3"
      style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}>
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm gradient-text leading-none">Soft Computing</div>
            <div className="text-[9px] text-[var(--text-muted)] tracking-widest uppercase leading-none">Interactive Lab</div>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[rgba(108,99,255,0.2)] text-[#6C63FF] border border-[rgba(108,99,255,0.3)]'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
