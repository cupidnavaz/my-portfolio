import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import type { PortfolioDetails } from '@/types';

interface Props {
  portfolio: PortfolioDetails | null;
}

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#projects', label: 'Projects' },
  { href: '#services', label: 'Services' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ portfolio }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-ink-800/50' : 'bg-transparent'}`}>
      <div className="container-max px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display font-bold text-lg text-white hover:text-accent-400 transition-colors">
            {portfolio?.name?.split(' ')[0] ?? 'Portfolio'}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
            <Link to="/admin/login" className="text-ink-500 hover:text-ink-300 transition-colors text-sm">
              Admin
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-ink-200 p-2">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 animate-slide-in">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="nav-link py-1">{l.label}</a>
            ))}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="nav-link py-1 text-ink-500">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
