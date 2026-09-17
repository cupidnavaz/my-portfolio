import { useEffect, useState, type ReactNode } from 'react';
import { Plus, Search, Pencil, Trash2, X, Loader2, Save, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface Props<T extends { id: string }> {
  table: string;
  title: string;
  description: string;
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  orderBy?: { column: string; ascending: boolean };
  renderForm: (item: T, setItem: (item: T) => void) => ReactNode;
  emptyItem: T;
  itemName: string;
}

// Fields managed by the database — must not be sent from the client
const SERVER_FIELDS = new Set(['user_id', 'created_at', 'updated_at']);

export default function CrudManager<T extends { id: string }>({
  table, title, description, columns, searchKeys, orderBy, renderForm, emptyItem, itemName,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from(table).select('*');
    if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending });
    else q = q.order('created_at', { ascending: false });
    const { data } = await q;
    setItems((data ?? []) as T[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(item =>
    searchKeys.some(k => String(item[k] ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const stripServerFields = (obj: Record<string, unknown>): Record<string, unknown> => {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!SERVER_FIELDS.has(key)) cleaned[key] = value;
    }
    return cleaned;
  };

  const handleSave = async (item: T) => {
    setSaving(true);
    setSaveError(null);
    const { id, ...rest } = item as Record<string, unknown>;
    const payload = stripServerFields(rest);

    let error: { message: string } | null = null;
    if (id) {
      const res = await supabase.from(table).update(payload as never).eq('id', id as string).select();
      error = res.error;
    } else {
      const res = await supabase.from(table).insert(payload as never).select();
      error = res.error;
    }

    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setSaveError(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${itemName}?`)) return;
    await supabase.from(table).delete().eq('id', id);
    load();
  };

  const openNew = () => {
    setEditing({ ...emptyItem });
    setSaveError(null);
    setShowForm(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setSaveError(null);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
    setSaveError(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-ink-400 text-sm">{description}</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm whitespace-nowrap">
          <Plus size={18} /> Add {itemName}
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${itemName}...`} className="input-field pl-11" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-ink-400">No {itemName}s found. Click "Add {itemName}" to create one.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900/50">
                  {columns.map(col => (
                    <th key={String(col.key)} className="text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">{col.label}</th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors">
                    {columns.map(col => (
                      <td key={String(col.key)} className="px-4 py-3 text-sm text-ink-200">
                        {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-ink-400 hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-ink-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{editing.id ? `Edit ${itemName}` : `New ${itemName}`}</h2>
              <button onClick={closeModal} className="text-ink-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            {renderForm(editing, (item: T) => setEditing(item))}
            {saveError && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{saveError}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-ink-800">
              <button onClick={() => handleSave(editing)} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save</>}
              </button>
              <button onClick={closeModal} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
