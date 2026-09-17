import { ExternalLink, Github, Star } from 'lucide-react';
import type { Project } from '@/types';

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
  if (projects.length === 0) return null;

  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);
  const display = [...featured, ...rest];

  return (
    <section id="projects" className="section-padding bg-ink-900/30">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Portfolio</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Featured Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((project, i) => (
            <div key={project.id} className="group glass-card overflow-hidden hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              {project.image_url ? (
                <div className="aspect-video overflow-hidden bg-ink-800">
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center">
                  <span className="font-display text-3xl text-ink-700 font-bold">{project.title.charAt(0)}</span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display font-semibold text-white text-lg group-hover:text-accent-400 transition-colors">{project.title}</h3>
                  {project.featured && (
                    <span className="flex items-center gap-1 text-xs text-accent-400 bg-accent-500/10 px-2 py-1 rounded-full border border-accent-500/20">
                      <Star size={12} /> Featured
                    </span>
                  )}
                </div>
                {project.description && <p className="text-ink-400 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs text-ink-300 bg-ink-800/60 px-2.5 py-1 rounded-md border border-ink-700/50">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-accent-400 transition-colors">
                      <ExternalLink size={16} /> Live
                    </a>
                  )}
                  {project.repo_url && (
                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-accent-400 transition-colors">
                      <Github size={16} /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
