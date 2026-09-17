import { ArrowDown, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import type { PortfolioDetails } from '@/types';

interface Props {
  portfolio: PortfolioDetails | null;
}

export default function Hero({ portfolio }: Props) {
  const name = portfolio?.name ?? 'Your Name';
  const title = portfolio?.title ?? 'Your Title';
  const tagline = portfolio?.tagline ?? '';
  const available = portfolio?.available_for_work ?? true;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent-700/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container-max px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {available && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
              </span>
              Available for work
            </div>
          )}

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05]">
            Hi, I'm <span className="gradient-text">{name}</span>
          </h1>

          <p className="text-xl md:text-2xl text-ink-300 mb-4 font-medium">{title}</p>
          {tagline && <p className="text-lg text-ink-400 mb-10 max-w-2xl mx-auto leading-relaxed">{tagline}</p>}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="#projects" className="btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn-ghost">
              Get In Touch
            </a>
          </div>

          <div className="flex items-center justify-center gap-6">
            {portfolio?.github_url && (
              <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200">
                <Github size={22} />
              </a>
            )}
            {portfolio?.linkedin_url && (
              <a href={portfolio.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200">
                <Linkedin size={22} />
              </a>
            )}
            {portfolio?.email && (
              <a href={`mailto:${portfolio.email}`} className="text-ink-400 hover:text-accent-400 transition-colors hover:scale-110 duration-200">
                <Mail size={22} />
              </a>
            )}
            {portfolio?.location && (
              <div className="flex items-center gap-2 text-ink-500 text-sm">
                <MapPin size={16} />
                {portfolio.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-500 hover:text-accent-400 transition-colors animate-bounce">
        <ArrowDown size={28} />
      </a>
    </section>
  );
}
