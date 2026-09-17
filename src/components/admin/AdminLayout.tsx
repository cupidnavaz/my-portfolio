import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, FolderGit2, FileText, Wrench, Cpu, Briefcase, GraduationCap, Award, Mail, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolio', label: 'Portfolio Details', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/posts', label: 'Blog Posts', icon: FileText },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/skills', label: 'Skills', icon: Cpu },
  { to: '/admin/experiences', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/certifications', label: 'Certifications', icon: Award },
  { to: '/admin/contacts', label: 'Messages', icon: Mail },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink-900 border-r border-ink-800 flex flex-col fixed h-screen z-30 hidden md:flex">
        <div className="p-6 border-b border-ink-800">
          <h1 className="font-display font-bold text-white text-lg">Admin Panel</h1>
          <p className="text-ink-500 text-xs mt-1">Portfolio Manager</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                      : 'text-ink-400 hover:text-white hover:bg-ink-800/50 border border-transparent'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-ink-800 space-y-1">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-ink-400 hover:text-white hover:bg-ink-800/50 transition-all">
            <ExternalLink size={18} /> View Site
          </a>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-ink-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-ink-900 border-b border-ink-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-white">Admin</h1>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="text-ink-400 hover:text-white p-2"><ExternalLink size={18} /></a>
            <button onClick={handleSignOut} className="text-ink-400 hover:text-red-400 p-2"><LogOut size={18} /></button>
          </div>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive ? 'bg-accent-500/10 text-accent-400' : 'text-ink-400 hover:text-white'
                }`
              }>
                <Icon size={14} /> {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-28 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
