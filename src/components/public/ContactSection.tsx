import { useState } from 'react';
import { Send, Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PortfolioDetails } from '@/types';

interface Props {
  portfolio: PortfolioDetails | null;
}

export default function ContactSection({ portfolio }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    const { error } = await supabase.from('contacts').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Contact</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Let's Work Together</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            <p className="text-ink-300 text-lg leading-relaxed mb-8">
              Have a project in mind or just want to say hello? I'm always open to discussing new opportunities, creative ideas, and ways to help bring your vision to life.
            </p>
            <div className="space-y-4">
              {portfolio?.email && (
                <a href={`mailto:${portfolio.email}`} className="flex items-center gap-4 text-ink-300 hover:text-accent-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-accent-400" />
                  </div>
                  {portfolio.email}
                </a>
              )}
              {portfolio?.phone && (
                <div className="flex items-center gap-4 text-ink-300">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                    <Phone size={18} className="text-accent-400" />
                  </div>
                  {portfolio.phone}
                </div>
              )}
              {portfolio?.location && (
                <div className="flex items-center gap-4 text-ink-300">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                    <MapPin size={18} className="text-accent-400" />
                  </div>
                  {portfolio.location}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-ink-300 mb-2">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm text-ink-300 mb-2">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Subject</label>
              <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="What's this about?" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="input-field resize-none" placeholder="Your message..." required />
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'sending' ? 'Sending...' : status === 'sent' ? (
                <><CheckCircle size={18} /> Message Sent!</>
              ) : (
                <>Send Message <Send size={18} /></>
              )}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
