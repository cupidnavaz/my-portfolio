import type { PortfolioDetails } from '@/types';

interface Props {
  portfolio: PortfolioDetails | null;
}

export default function About({ portfolio }: Props) {
  const bio = portfolio?.bio ?? 'Welcome to my portfolio. I am passionate about building great software and creating impactful digital experiences.';
  const name = portfolio?.name ?? 'Your Name';
  const title = portfolio?.title ?? 'Your Title';

  return (
    <section id="about" className="section-padding relative">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="animate-fade-in-up">
            <div className="relative">
              {portfolio?.avatar_url ? (
                <img src={portfolio.avatar_url} alt={name} className="w-full max-w-md rounded-2xl border border-ink-800 object-cover aspect-round" />
              ) : (
                <div className="w-full max-w-md rounded-2xl border border-ink-800 aspect-square flex items-center justify-center bg-ink-900">
                  <span className="font-display text-8xl text-ink-700 font-bold">{name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-500/10 rounded-2xl blur-2xl -z-10" />
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-accent-400 font-mono text-sm mb-4">// About Me</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              {title}
            </h2>
            <p className="text-ink-300 leading-relaxed mb-6 text-lg">{bio}</p>

            {portfolio?.resume_url && (
              <a href={portfolio.resume_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
