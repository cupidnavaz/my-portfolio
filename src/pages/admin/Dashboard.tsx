import { useEffect, useState } from 'react';
import { FolderGit2, FileText, Wrench, Cpu, Briefcase, GraduationCap, Award, Mail, MailOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  projects: number;
  posts: number;
  services: number;
  skills: number;
  experiences: number;
  education: number;
  certifications: number;
  contacts: number;
  unread: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, po, s, sk, e, ed, cert, c, cu] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('experiences').select('id', { count: 'exact', head: true }),
        supabase.from('education').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('is_read', false),
      ]);

      setStats({
        projects: p.count ?? 0,
        posts: po.count ?? 0,
        services: s.count ?? 0,
        skills: sk.count ?? 0,
        experiences: e.count ?? 0,
        education: ed.count ?? 0,
        certifications: cert.count ?? 0,
        contacts: c.count ?? 0,
        unread: cu.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Projects', value: stats!.projects, icon: FolderGit2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Blog Posts', value: stats!.posts, icon: FileText, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { label: 'Services', value: stats!.services, icon: Wrench, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Skills', value: stats!.skills, icon: Cpu, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Experience', value: stats!.experiences, icon: Briefcase, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Education', value: stats!.education, icon: GraduationCap, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { label: 'Certifications', value: stats!.certifications, icon: Award, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { label: 'Messages', value: stats!.contacts, icon: Mail, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { label: 'Unread', value: stats!.unread, icon: MailOpen, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-ink-400 mb-8 text-sm">Overview of your portfolio content</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-5 hover:border-ink-600 transition-all">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${card.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-white font-display">{card.value}</p>
              <p className="text-ink-500 text-xs mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 glass-card p-6">
        <h2 className="font-display font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/portfolio" className="btn-ghost text-sm">Edit Profile</a>
          <a href="/admin/projects" className="btn-ghost text-sm">Add Project</a>
          <a href="/admin/posts" className="btn-ghost text-sm">Write Post</a>
          <a href="/admin/contacts" className="btn-ghost text-sm">View Messages</a>
        </div>
      </div>
    </div>
  );
}
