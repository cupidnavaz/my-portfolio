import { Award, ExternalLink, Calendar } from 'lucide-react';
import type { Certification } from '@/types';

interface Props {
  certifications: Certification[];
}

export default function Certifications({ certifications }: Props) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-padding bg-ink-900/30">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Certifications</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Training & Certifications</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <div
              key={cert.id}
              className="group glass-card p-6 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award size={24} className="text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white text-base leading-snug group-hover:text-accent-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-ink-400 text-sm mt-1">{cert.issuer}</p>
                </div>
              </div>

              {cert.description && (
                <p className="text-ink-400 text-sm leading-relaxed mb-4">{cert.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {cert.issue_date}
                  {cert.expiry_date && ` — ${cert.expiry_date}`}
                </span>
                {cert.credential_id && (
                  <span className="font-mono">ID: {cert.credential_id}</span>
                )}
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300 transition-colors mt-4"
                >
                  <ExternalLink size={15} /> Verify Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
