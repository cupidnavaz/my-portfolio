import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const { session, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'login' ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-accent-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <Link to="/" className="inline-flex items-center gap-2 text-ink-400 hover:text-accent-400 transition-colors text-sm mb-8">
          <ArrowLeft size={18} /> Back to site
        </Link>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <Lock size={24} className="text-accent-400" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">
                {mode === 'login' ? 'Admin Login' : 'Create Account'}
              </h1>
              <p className="text-ink-500 text-sm">
                {mode === 'login' ? 'Sign in to manage your portfolio' : 'Sign up to get started'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-11" placeholder="••••••••" required minLength={6} />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
              className="text-sm text-ink-400 hover:text-accent-400 transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
