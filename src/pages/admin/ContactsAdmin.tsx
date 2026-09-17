import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Contact } from '@/types';
import { Mail, MailOpen, Trash2, X, Loader2 } from 'lucide-react';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = async () => {
    setLoading(true);
    let q = supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (filter === 'unread') q = q.eq('is_read', false);
    const { data } = await q;
    setContacts((data ?? []) as Contact[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const markRead = async (contact: Contact) => {
    if (contact.is_read) return;
    await supabase.from('contacts').update({ is_read: true }).eq('id', contact.id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contacts').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const openMessage = (contact: Contact) => {
    setSelected(contact);
    markRead(contact);
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Messages</h1>
      <p className="text-ink-400 mb-8 text-sm">Contact form submissions from your portfolio</p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'text-ink-400 hover:text-white border border-transparent'}`}
        >
          All Messages
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unread' ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'text-ink-400 hover:text-white border border-transparent'}`}
        >
          Unread Only
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail size={32} className="text-ink-600 mx-auto mb-3" />
          <p className="text-ink-400">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => openMessage(contact)}
              className={`glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-ink-600 transition-all ${!contact.is_read ? 'border-accent-500/20' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${contact.is_read ? 'bg-ink-800' : 'bg-accent-500/10 border border-accent-500/20'}`}>
                {contact.is_read ? <MailOpen size={18} className="text-ink-500" /> : <Mail size={18} className="text-accent-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${contact.is_read ? 'text-ink-300' : 'text-white'}`}>{contact.name}</span>
                  {!contact.is_read && <span className="w-2 h-2 rounded-full bg-accent-400 shrink-0" />}
                </div>
                <p className="text-ink-500 text-xs truncate">{contact.subject || contact.message}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-ink-500 text-xs hidden sm:block">{new Date(contact.created_at).toLocaleDateString()}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                  className="p-2 text-ink-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="glass-card w-full max-w-lg p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-white">Message</h2>
              <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-ink-500 text-xs mb-1">From</p>
                <p className="text-white font-medium">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="text-accent-400 text-sm hover:underline">{selected.email}</a>
              </div>
              {selected.subject && (
                <div>
                  <p className="text-ink-500 text-xs mb-1">Subject</p>
                  <p className="text-ink-200">{selected.subject}</p>
                </div>
              )}
              <div>
                <p className="text-ink-500 text-xs mb-1">Message</p>
                <p className="text-ink-200 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <div>
                <p className="text-ink-500 text-xs mb-1">Received</p>
                <p className="text-ink-400 text-sm">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-ink-800">
              <a href={`mailto:${selected.email}`} className="btn-primary text-sm">Reply</a>
              <button onClick={() => handleDelete(selected.id)} className="btn-ghost text-sm text-red-400 hover:text-red-300">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
