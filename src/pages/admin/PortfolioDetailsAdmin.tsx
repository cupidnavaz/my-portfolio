import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { PortfolioDetails } from '@/types';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

export default function PortfolioDetailsAdmin() {
  const [data, setData] = useState<PortfolioDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from('portfolio_details').select('*').maybeSingle();
      if (d) setData(d);
      else setData(null);
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    const { id, created_at, updated_at, user_id, ...updates } = data;
    let error: { message: string } | null = null;
    if (id) {
      const res = await supabase.from('portfolio_details').update(updates).eq('id', id).select();
      error = res.error;
    } else {
      const res = await supabase.from('portfolio_details').insert(updates).select();
      error = res.error;
    }
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setSaveError(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const v = data ?? {
    id: '', user_id: '', name: '', title: '', tagline: '', bio: '', avatar_url: '', resume_url: '',
    email: '', phone: '', location: '', github_url: '', linkedin_url: '', twitter_url: '', website_url: '',
    available_for_work: true, created_at: '', updated_at: '',
  };

  const set = (key: keyof PortfolioDetails, val: string | boolean) => {
    setData({ ...v, [key]: val } as PortfolioDetails);
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Portfolio Details</h1>
      <p className="text-ink-400 mb-8 text-sm">Manage your personal information displayed on the portfolio</p>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-white text-lg">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name" value={v.name} onChange={e => set('name', e.target.value)} />
            <Field label="Title" value={v.title} onChange={e => set('title', e.target.value)} />
          </div>
          <Field label="Tagline" value={v.tagline ?? ''} onChange={e => set('tagline', e.target.value)} />
          <div>
            <label className="block text-sm text-ink-300 mb-2">Bio</label>
            <textarea value={v.bio ?? ''} onChange={e => set('bio', e.target.value)} rows={5} className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <FileUpload
                bucket="images"
                folder="avatar"
                value={v.avatar_url ?? ''}
                onChange={url => set('avatar_url', url)}
                accept="image/*"
                label="Avatar Photo"
              />
              <input type="text" value={v.avatar_url ?? ''} onChange={e => set('avatar_url', e.target.value)} className="input-field mt-2" placeholder="or paste image URL" />
            </div>
            <div>
              <FileUpload
                bucket="documents"
                folder="resume"
                value={v.resume_url ?? ''}
                onChange={url => set('resume_url', url)}
                accept=".pdf,.doc,.docx"
                label="Resume / CV"
                imagePreview={false}
              />
              <input type="text" value={v.resume_url ?? ''} onChange={e => set('resume_url', e.target.value)} className="input-field mt-2" placeholder="or paste document URL" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={v.available_for_work} onChange={e => set('available_for_work', e.target.checked)} className="w-4 h-4 accent-accent-500" />
            <span className="text-ink-200 text-sm">Available for work</span>
          </label>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-white text-lg">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Email" value={v.email ?? ''} onChange={e => set('email', e.target.value)} />
            <Field label="Phone" value={v.phone ?? ''} onChange={e => set('phone', e.target.value)} />
            <Field label="Location" value={v.location ?? ''} onChange={e => set('location', e.target.value)} />
            <Field label="Website URL" value={v.website_url ?? ''} onChange={e => set('website_url', e.target.value)} />
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-white text-lg">Social Links</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="GitHub URL" value={v.github_url ?? ''} onChange={e => set('github_url', e.target.value)} />
            <Field label="LinkedIn URL" value={v.linkedin_url ?? ''} onChange={e => set('linkedin_url', e.target.value)} />
            <Field label="Twitter URL" value={v.twitter_url ?? ''} onChange={e => set('twitter_url', e.target.value)} />
          </div>
        </div>

        {saveError && (
          <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{saveError}</span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
          {saved && <span className="text-green-400 text-sm">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="block text-sm text-ink-300 mb-2">{label}</label>
      <input type="text" value={value} onChange={onChange} className="input-field" />
    </div>
  );
}
