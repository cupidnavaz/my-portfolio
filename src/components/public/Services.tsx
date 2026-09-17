import * as Icons from 'lucide-react';
import type { Service } from '@/types';

interface Props {
  services: Service[];
}

export default function Services({ services }: Props) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="section-padding bg-ink-900/30">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Services</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">What I Offer</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon_name] ?? Icons.Code;
            return (
              <div key={service.id} className="group glass-card p-8 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-accent-400" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-3">{service.title}</h3>
                {service.description && <p className="text-ink-400 text-sm leading-relaxed">{service.description}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
