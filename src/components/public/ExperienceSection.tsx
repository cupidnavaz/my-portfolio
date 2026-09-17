import { Briefcase, GraduationCap } from 'lucide-react';
import type { Experience, Education } from '@/types';

interface Props {
  experiences: Experience[];
  education: Education[];
}

export default function ExperienceSection({ experiences, education }: Props) {
  if (experiences.length === 0 && education.length === 0) return null;

  return (
    <section id="experience" className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Journey</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Experience & Education</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {experiences.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                  <Briefcase size={20} className="text-accent-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">Work Experience</h3>
              </div>
              <div className="relative pl-6 border-l border-ink-800 space-y-8">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-accent-500 border-2 border-ink-950" />
                    <div className="glass-card p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h4 className="font-semibold text-white">{exp.role}</h4>
                        <span className="text-xs text-ink-500 font-mono">{exp.start_date}{exp.current ? ' — Present' : exp.end_date ? ` — ${exp.end_date}` : ''}</span>
                      </div>
                      <p className="text-accent-400 text-sm mb-3">{exp.company}</p>
                      {exp.description && <p className="text-ink-300 text-sm leading-relaxed">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                  <GraduationCap size={20} className="text-accent-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">Education</h3>
              </div>
              <div className="relative pl-6 border-l border-ink-800 space-y-8">
                {education.map((ed, i) => (
                  <div key={ed.id} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-accent-500 border-2 border-ink-950" />
                    <div className="glass-card p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h4 className="font-semibold text-white">{ed.degree}</h4>
                        <span className="text-xs text-ink-500 font-mono">{ed.start_date}{ed.current ? ' — Present' : ed.end_date ? ` — ${ed.end_date}` : ''}</span>
                      </div>
                      <p className="text-accent-400 text-sm mb-3">{ed.institution}</p>
                      {ed.description && <p className="text-ink-300 text-sm leading-relaxed">{ed.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
