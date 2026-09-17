import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import type { PortfolioDetails } from '@/types';

interface Props {
  portfolio: PortfolioDetails | null;
}

export default function Footer({ portfolio }: Props) {
  const year = new Date().getFullYear();
  const name = portfolio?.name ?? 'Portfolio';

  return (
    <footer className="border-t border-ink-800/50 bg-ink-950">
      <div className="container-max px-6 md:px-12 lg:px-20 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">{name}</p>
            <p className="text-ink-500 text-sm">&copy; {year} All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4">
            {portfolio?.github_url && <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200"><Github size={20} /></a>}
            {portfolio?.linkedin_url && <a href={portfolio.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200"><Linkedin size={20} /></a>}
            {portfolio?.twitter_url && <a href={portfolio.twitter_url} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200"><Twitter size={20} /></a>}
            {portfolio?.email && <a href={`mailto:${portfolio.email}`} className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200"><Mail size={20} /></a>}
          </div>

          <Link to="/admin/login" className="text-ink-600 hover:text-ink-400 transition-colors text-sm">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
