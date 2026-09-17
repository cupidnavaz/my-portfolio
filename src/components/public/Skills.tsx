import type { Skill } from '@/types';

interface Props {
  skills: Skill[];
}

export default function Skills({ skills }: Props) {
  if (skills.length === 0) return null;

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="section-padding bg-ink-900/30">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Skills</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">What I Work With</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={cat} className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <h3 className="font-display font-semibold text-white mb-5 text-lg">{cat}</h3>
              <div className="space-y-4">
                {skills.filter(s => s.category === cat).map(skill => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-ink-200 text-sm font-medium">{skill.name}</span>
                      <span className="text-ink-500 text-xs font-mono">{skill.proficiency}%</span>
                    </div>
                    <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-500 to-accent-300 rounded-full transition-all duration-700"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
